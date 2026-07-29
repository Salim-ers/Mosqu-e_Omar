#!/usr/bin/env node
/**
 * Crée le compte responsable de l'espace bénévoles, directement dans le
 * stockage configuré (base de données si DATABASE_URL est renseignée, sinon
 * dossier de données).
 *
 * Normalement inutile : au premier passage sur /admin, le site propose
 * lui-même de créer ce compte. Ce script sert quand on préfère préparer le
 * compte avant la mise en ligne, ou quand plus personne n'a accès à l'espace.
 *
 * Usage :
 *   npm run admin:creer -- --email imam@exemple.fr --nom "Prénom Nom"
 *   npm run admin:creer -- --email … --nom … --mdp "mot-de-passe-choisi"
 *   npm run admin:creer -- --email … --nom … --force   (compte déjà existant)
 *
 * Sans --mdp, un mot de passe solide est tiré au sort et affiché une fois.
 * Il n'est jamais stocké en clair : seule son empreinte scrypt part au
 * stockage — exactement comme lorsqu'un bénévole choisit son mot de passe
 * depuis le site.
 */

import { randomBytes, randomUUID, scrypt } from "node:crypto";
import { domainToASCII } from "node:url";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/* ------------------------------------------------------------ arguments --- */

const args = process.argv.slice(2);
const option = (nom) => {
  const i = args.indexOf(`--${nom}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const email = (option("email") ?? "").trim().toLowerCase().normalize("NFC");

/** Même canonisation que src/lib/auth.ts (domaine en ASCII pour comparer). */
function canonique(adresse) {
  const propre = adresse.trim().toLowerCase().normalize("NFC");
  const arobase = propre.lastIndexOf("@");
  if (arobase < 0) return propre;
  const domaine = propre.slice(arobase + 1);
  return `${propre.slice(0, arobase)}@${domainToASCII(domaine) || domaine}`;
}
const nom = (option("nom") ?? "").trim();
const force = args.includes("--force");
const role = args.includes("--editeur") ? "editeur" : "admin";

if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !nom) {
  console.error(
    "\n✖ Il manque des informations.\n" +
      '  npm run admin:creer -- --email imam@exemple.fr --nom "Prénom Nom"\n',
  );
  process.exit(1);
}

/* --------------------------------------------------------- mot de passe --- */

/** Mot de passe lisible et solide : quatre groupes de cinq caractères. */
function motDePasseAleatoire() {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const octets = randomBytes(20);
  const tirage = [...octets].map((o) => alphabet[o % alphabet.length]).join("");
  return [0, 5, 10, 15].map((i) => tirage.slice(i, i + 5)).join("-");
}

const motDePasse = option("mdp") ?? motDePasseAleatoire();
const genere = !option("mdp");

if (motDePasse.length < 10 || !/[a-zA-Z]/.test(motDePasse) || !/[0-9]/.test(motDePasse)) {
  console.error(
    "\n✖ Mot de passe trop faible : au moins 10 caractères, avec lettres et chiffres.\n",
  );
  process.exit(1);
}

/** Même format que src/lib/auth.ts : scrypt, sel aléatoire, clé de 64 octets. */
async function empreinte(mot) {
  const sel = randomBytes(16).toString("hex");
  const cle = await scryptAsync(mot.normalize("NFKC"), sel, 64);
  return `scrypt$${sel}$${cle.toString("hex")}`;
}

/* ------------------------------------------------------------- .env.local --- */

for (const fichier of [".env.local", ".env"]) {
  if (!existsSync(fichier)) continue;
  for (const ligne of readFileSync(fichier, "utf8").split("\n")) {
    const m = ligne.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const url =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.SUPABASE_DB_URL;

/* ------------------------------------------------------------- stockage --- */

async function comptesExistants() {
  if (url) {
    const { rows } = await client.query(
      "SELECT data FROM site_records WHERE collection = 'utilisateurs'",
    );
    return rows.map((r) => r.data);
  }
  const fichier = cheminFichier();
  if (!existsSync(fichier)) return [];
  try {
    return JSON.parse(readFileSync(fichier, "utf8"));
  } catch {
    return [];
  }
}

function cheminFichier() {
  const dossier = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(process.cwd(), ".data");
  return path.join(dossier, "utilisateurs.json");
}

async function enregistrer(compte) {
  if (url) {
    await client.query(
      `INSERT INTO site_records (collection, id, data) VALUES ('utilisateurs', $1, $2)
       ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data`,
      [compte.id, compte],
    );
    return;
  }
  const fichier = cheminFichier();
  mkdirSync(path.dirname(fichier), { recursive: true });
  const liste = await comptesExistants();
  liste.push(compte);
  writeFileSync(fichier, `${JSON.stringify(liste, null, 2)}\n`, "utf8");
}

let client;

try {
  if (url) {
    const pg = (await import("pg")).default;
    const local = /localhost|127\.0\.0\.1/.test(url);
    client = new pg.Client({
      connectionString: url,
      ssl: local ? undefined : { rejectUnauthorized: false },
      connectionTimeoutMillis: 15_000,
    });
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_records (
        collection text NOT NULL, id text NOT NULL, data jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (collection, id)
      );`);
  }

  const existants = await comptesExistants();

  if (existants.some((c) => canonique(c.email ?? "") === canonique(email))) {
    throw new Error(`Un compte utilise déjà l’adresse ${email}.`);
  }
  if (existants.length > 0 && !force) {
    throw new Error(
      `${existants.length} compte(s) existent déjà. Créez les suivants depuis ` +
        "/admin → Comptes bénévoles, ou relancez avec --force.",
    );
  }

  const compte = {
    id: randomUUID(),
    email,
    name: nom,
    role,
    passwordHash: await empreinte(motDePasse),
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    active: true,
  };

  await enregistrer(compte);

  console.log(
    "\n  ✔ Compte créé — stockage : " +
      (url ? "base de données" : "dossier de données"),
  );
  console.log(`\n     Rôle           ${role === "admin" ? "responsable" : "éditeur"}`);
  console.log(`     Adresse email  ${email}`);
  if (genere) {
    console.log(`     Mot de passe   ${motDePasse}`);
    console.log(
      "\n  Notez-le maintenant : il n’est affiché qu’une fois et n’est stocké" +
        "\n  nulle part en clair. Changez-le après la première connexion" +
        "\n  (/admin → Mon mot de passe).\n",
    );
  } else {
    console.log("     Mot de passe   celui que vous avez fourni\n");
  }
} catch (error) {
  console.error(`\n✖ ${error.message}\n`);
  process.exitCode = 1;
} finally {
  await client?.end().catch(() => {});
}
