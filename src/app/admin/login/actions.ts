"use server";

import { redirect } from "next/navigation";

import { logActivity } from "@/lib/admin/journal";
import {
  authenticate,
  createUser,
  hasAnyUser,
  passwordProblem,
  startSession,
} from "@/lib/auth";

/**
 * Connexion et création du tout premier compte. Deux garde-fous simples :
 *  – le message d'échec ne dit jamais si c'est l'email ou le mot de passe ;
 *  – au-delà de quelques tentatives ratées, l'adresse patiente une minute
 *    (compteur en mémoire — suffisant pour un site d'association).
 */

const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 6;
const LOCK_MS = 60_000;

function throttle(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.until > Date.now()) return true;
  if (entry.until <= Date.now()) attempts.delete(key);
  return false;
}

function noteFailure(key: string): void {
  const entry = attempts.get(key) ?? { count: 0, until: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.count = 0;
    entry.until = Date.now() + LOCK_MS;
  }
  attempts.set(key, entry);
}

export async function login(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const fail = (message: string) =>
    redirect(`/admin/login?erreur=${encodeURIComponent(message)}`);

  if (throttle(email)) {
    fail("Trop de tentatives. Réessayez dans une minute.");
  }

  const user = await authenticate(email, password);
  if (!user) {
    noteFailure(email);
    fail("Adresse email ou mot de passe incorrect.");
    return;
  }

  attempts.delete(email);
  await startSession(user.id);
  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "connexion",
    scope: "Espace bénévoles",
    label: "à l’espace bénévoles",
  });
  redirect("/admin");
}

/** Création du compte responsable — possible uniquement s'il n'en existe aucun. */
export async function createFirstAccount(formData: FormData): Promise<void> {
  if (await hasAnyUser()) {
    redirect(
      "/admin/login?erreur=" +
        encodeURIComponent("Un compte existe déjà : connectez-vous."),
    );
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const fail = (message: string) =>
    redirect(`/admin/login?erreur=${encodeURIComponent(message)}`);

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fail("Adresse email invalide.");
  if (!name) fail("Indiquez votre prénom et votre nom.");

  const problem = passwordProblem(password);
  if (problem) fail(problem);

  const user = await createUser({ email, name, password, role: "admin" });
  await startSession(user.id);
  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "compte",
    scope: "Comptes bénévoles",
    label: "création du compte responsable",
  });
  redirect("/admin");
}
