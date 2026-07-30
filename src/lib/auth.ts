import "server-only";

import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { domainToASCII } from "node:url";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  newId,
  readCollection,
  readOrCreateSecret,
  upsertRecord,
} from "@/lib/store";
import type { UserRecord, UserRole } from "@/lib/store/types";

/**
 * ============================================================================
 * AUTHENTIFICATION DES BÉNÉVOLES
 * ----------------------------------------------------------------------------
 * Volontairement minimale et sans dépendance : mots de passe dérivés par
 * scrypt (sel aléatoire par compte), session dans un cookie signé HMAC-SHA256,
 * `httpOnly` + `sameSite=lax`. Aucun mot de passe n'est jamais stocké ni
 * journalisé en clair.
 * ============================================================================
 */

const COOKIE_NAME = "mo_session";
/**
 * Durée de vie du jeton lui-même. Le cookie, lui, n'a pas de date
 * d'expiration : il disparaît à la fermeture du navigateur. Cette borne sert
 * de garde-fou côté serveur — un jeton copié ailleurs ne vaut pas au-delà.
 */
const SESSION_HOURS = 12;
const SCRYPT_KEYLEN = 64;

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

/* ------------------------------------------------------------ adresses --- */

/**
 * Forme canonique d'une adresse email, pour la comparaison uniquement.
 *
 * Les navigateurs convertissent le domaine d'un champ `type="email"` en ASCII
 * avant de l'envoyer : « admin@mosquéeomar.fr » part en
 * « admin@xn--mosqueomar-f7a.fr ». Sans cette conversion des deux côtés, un
 * compte à domaine accentué serait impossible à utiliser — l'adresse saisie
 * et l'adresse stockée ne se ressembleraient plus.
 *
 * L'adresse reste affichée telle qu'elle a été saisie ; seule la comparaison
 * passe par ici.
 */
export function canonicalEmail(email: string): string {
  const propre = email.trim().toLowerCase().normalize("NFC");
  const arobase = propre.lastIndexOf("@");
  if (arobase < 0) return propre;

  const partieLocale = propre.slice(0, arobase);
  const domaine = propre.slice(arobase + 1);
  return `${partieLocale}@${domainToASCII(domaine) || domaine}`;
}

/* ------------------------------------------------------ mots de passe --- */

/**
 * Prépare un mot de passe avant dérivation. Les espaces de début et de fin
 * sont retirés : un mot de passe transmis par message est presque toujours
 * copié-collé, et un espace ou un retour à la ligne invisible en fin de
 * sélection suffirait à faire échouer la connexion sans rien laisser voir.
 * La même préparation est appliquée à l'enregistrement et à la vérification.
 */
function preparePassword(password: string): string {
  return password.trim().normalize("NFKC");
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(preparePassword(password), salt, SCRYPT_KEYLEN);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const derived = await scryptAsync(preparePassword(password), salt, SCRYPT_KEYLEN);
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}

/** Règle de robustesse minimale, affichée telle quelle dans le formulaire. */
export function passwordProblem(input: string): string | null {
  const password = preparePassword(input);
  if (password.length < 10)
    return "Le mot de passe doit contenir au moins 10 caractères.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    return "Le mot de passe doit contenir au moins une lettre et un chiffre.";
  return null;
}

/* ----------------------------------------------------------- sessions --- */

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64url(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

async function sign(payload: string): Promise<string> {
  const secret = await readOrCreateSecret();
  return base64url(createHmac("sha256", secret).update(payload).digest());
}

async function createToken(userId: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = base64url(JSON.stringify({ sub: userId, exp: expiresAt }));
  return `${payload}.${await sign(payload)}`;
}

async function readToken(token: string): Promise<string | null> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = await sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(fromBase64url(payload).toString("utf8")) as {
      sub?: string;
      exp?: number;
    };
    if (!parsed.sub || !parsed.exp || parsed.exp < Date.now()) return null;
    return parsed.sub;
  } catch {
    return null;
  }
}

/**
 * Ouvre la session. Volontairement sans `maxAge` ni `expires` : le cookie est
 * alors un cookie de session, que le navigateur efface en se fermant. Un
 * bénévole qui met le site à jour depuis un poste partagé — l'accueil de la
 * mosquée, un ordinateur familial — n'y laisse pas son accès ouvert.
 */
export async function startSession(userId: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, await createToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/* ------------------------------------------------------------ comptes --- */

export type SessionUser = Omit<UserRecord, "passwordHash">;

/** Retire l'empreinte du mot de passe avant toute sortie du module. */
function publicUser(user: UserRecord): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    active: user.active,
  };
}

export async function getUsers(): Promise<UserRecord[]> {
  return readCollection("utilisateurs");
}

export async function hasAnyUser(): Promise<boolean> {
  return (await getUsers()).length > 0;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const userId = await readToken(token);
  if (!userId) return null;

  const user = (await getUsers()).find((u) => u.id === userId);
  if (!user || !user.active) return null;
  return publicUser(user);
}

/** Garde d'accès : toute page ou action de /admin passe par ici. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Garde d'accès réservée aux responsables (comptes et réglages). */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin?erreur=reserve");
  return user;
}

/** Identifie un compte ; renvoie `null` sans distinguer email et mot de passe. */
export async function authenticate(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const recherche = canonicalEmail(email);
  const user = (await getUsers()).find(
    (u) => canonicalEmail(u.email) === recherche && u.active,
  );
  if (!user) {
    // Coût constant : on hache quand même pour ne pas révéler l'existence
    // du compte par la durée de la réponse.
    await hashPassword(password);
    return null;
  }
  if (!(await verifyPassword(password, user.passwordHash))) return null;

  await upsertRecord("utilisateurs", {
    ...user,
    lastLoginAt: new Date().toISOString(),
  });
  return publicUser(user);
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}): Promise<UserRecord> {
  const user: UserRecord = {
    id: newId(),
    email: input.email.trim().toLowerCase().normalize("NFC"),
    name: input.name.trim(),
    role: input.role,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    active: true,
  };
  await upsertRecord("utilisateurs", user);
  return user;
}
