#!/usr/bin/env node
/**
 * Vérifie que la base de données (Supabase, Neon…) est joignable et qu'elle
 * accepte tout ce dont le site a besoin : créer les tables, écrire et relire
 * un contenu, écrire et relire une photo.
 *
 * À lancer une fois, après avoir renseigné DATABASE_URL — avant de déployer.
 *
 * Usage :  npm run db:verifier
 *          node scripts/verifier-base.mjs "postgresql://…"
 *
 * Les instructions SQL reproduisent celles de src/lib/store/driver-postgres.ts.
 */

import { randomUUID } from "node:crypto";
import pg from "pg";

const url = process.argv[2] ?? process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!url) {
  console.error(
    "\n✖ Aucune URL de base de données.\n" +
      "  Renseignez DATABASE_URL dans .env.local, ou passez-la en argument :\n" +
      '  node scripts/verifier-base.mjs "postgresql://…"\n',
  );
  process.exit(1);
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS site_records (
  collection  text        NOT NULL,
  id          text        NOT NULL,
  data        jsonb       NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (collection, id)
);
CREATE INDEX IF NOT EXISTS site_records_collection_idx
  ON site_records (collection, created_at);
CREATE TABLE IF NOT EXISTS site_documents (
  key        text        PRIMARY KEY,
  value      jsonb       NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS site_files (
  name       text        PRIMARY KEY,
  mime       text        NOT NULL,
  bytes      bytea       NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
`;

const local = /localhost|127\.0\.0\.1/.test(url);
const client = new pg.Client({
  connectionString: url,
  ssl: local ? undefined : { rejectUnauthorized: false },
  connectionTimeoutMillis: 15_000,
});

const etapes = [];
const ok = (texte) => etapes.push(`  ✔ ${texte}`);

try {
  await client.connect();
  const { rows } = await client.query("SELECT version()");
  ok(`connexion établie — ${rows[0].version.split(",")[0]}`);

  await client.query(SCHEMA);
  ok("tables site_records, site_documents et site_files en place");

  const id = randomUUID();
  const contenu = { id, title: "Essai de connexion", published: true };

  await client.query(
    `INSERT INTO site_records (collection, id, data) VALUES ($1, $2, $3)
     ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data`,
    ["__verification", id, contenu],
  );
  const relu = await client.query(
    "SELECT data FROM site_records WHERE collection = $1 AND id = $2",
    ["__verification", id],
  );
  if (relu.rows[0]?.data?.title !== contenu.title) {
    throw new Error("le contenu relu ne correspond pas à celui écrit");
  }
  ok("écriture et relecture d’un contenu");

  const octets = Buffer.from("photo-de-test-".repeat(64), "utf8");
  await client.query(
    `INSERT INTO site_files (name, mime, bytes) VALUES ($1, $2, $3)
     ON CONFLICT (name) DO UPDATE SET bytes = EXCLUDED.bytes`,
    [`${id}.jpg`, "image/jpeg", octets],
  );
  const fichier = await client.query(
    "SELECT mime, bytes FROM site_files WHERE name = $1",
    [`${id}.jpg`],
  );
  if (!octets.equals(fichier.rows[0].bytes)) {
    throw new Error("la photo relue ne correspond pas à celle écrite");
  }
  ok(`écriture et relecture d’une photo (${octets.length} octets, à l’identique)`);

  await client.query("DELETE FROM site_records WHERE collection = $1", [
    "__verification",
  ]);
  await client.query("DELETE FROM site_files WHERE name = $1", [`${id}.jpg`]);
  ok("nettoyage des données d’essai");

  console.log("\n" + etapes.join("\n"));
  console.log(
    "\n✔ La base est prête. Les contenus saisis dans /admin y seront conservés.\n",
  );
} catch (error) {
  if (etapes.length > 0) console.log("\n" + etapes.join("\n"));
  console.error(`\n✖ Échec : ${error.message}\n`);
  console.error(
    "  Pistes : URL incomplète (le mot de passe doit y figurer), projet Supabase\n" +
      "  en pause, ou adresse du « pooler » incorrecte. Voir la section Supabase\n" +
      "  du README.\n",
  );
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
