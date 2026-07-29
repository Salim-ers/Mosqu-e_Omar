import "server-only";

import { Pool } from "pg";

import { databaseUrl, type StoreDriver, type StoredFile } from "@/lib/store/driver";

/**
 * ============================================================================
 * STOCKAGE POSTGRES (SUPABASE, NEON…)
 * ----------------------------------------------------------------------------
 * Le choix pour un hébergement sans disque persistant : les contenus et les
 * photos vivent dans la base, rien ne se perd au redéploiement.
 *
 * Trois tables, créées automatiquement au premier démarrage — aucun SQL à
 * exécuter à la main :
 *   site_records   un enregistrement par contenu (clé : collection + id) ;
 *   site_documents les documents uniques (réglages, secret de session) ;
 *   site_files     les photos envoyées depuis l'admin.
 *
 * Les photos sont stockées dans la base plutôt que dans un service de fichiers
 * séparé : elles sont déjà réduites par le navigateur avant l'envoi (quelques
 * centaines de kilo-octets), et cela évite une dépendance de plus à
 * administrer pour l'association.
 * ============================================================================
 */

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

export async function createPostgresDriver(): Promise<StoreDriver> {
  const connectionString = databaseUrl();
  if (!connectionString) {
    throw new Error("Aucune URL de base de données fournie.");
  }

  const local = /localhost|127\.0\.0\.1/.test(connectionString);
  const pool = new Pool({
    connectionString,
    // Supabase et Neon imposent TLS ; leurs certificats sont signés par une
    // autorité que Node ne connaît pas par défaut.
    ssl: local ? undefined : { rejectUnauthorized: false },
    max: 4,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  await pool.query(SCHEMA);

  return {
    label: "base de données",

    async readCollection(collection) {
      const { rows } = await pool.query<{ data: unknown }>(
        "SELECT data FROM site_records WHERE collection = $1 ORDER BY created_at",
        [collection],
      );
      return rows.map((row) => row.data);
    },

    async collectionStats(collections, flag) {
      const { rows } = await pool.query<{
        collection: string;
        total: string;
        without: string;
      }>(
        `SELECT collection,
                count(*) AS total,
                count(*) FILTER (
                  WHERE coalesce((data ->> $2)::boolean, false) IS NOT TRUE
                ) AS without
           FROM site_records
          WHERE collection = ANY($1)
          GROUP BY collection`,
        [collections, flag],
      );

      const stats: Record<string, { total: number; without: number }> = {};
      for (const nom of collections) stats[nom] = { total: 0, without: 0 };
      for (const row of rows) {
        stats[row.collection] = {
          total: Number(row.total),
          without: Number(row.without),
        };
      }
      return stats;
    },

    async readRecent(collection, dateKey, limit) {
      const { rows } = await pool.query<{ data: unknown }>(
        `SELECT data FROM site_records
          WHERE collection = $1
          ORDER BY data ->> $2 DESC
          LIMIT $3`,
        [collection, dateKey, limit],
      );
      return rows.map((row) => row.data);
    },

    async writeCollection(collection, records) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query("DELETE FROM site_records WHERE collection = $1", [
          collection,
        ]);
        for (const record of records) {
          const id = (record as { id?: string })?.id;
          if (!id) continue;
          await client.query(
            "INSERT INTO site_records (collection, id, data) VALUES ($1, $2, $3)",
            [collection, id, record],
          );
        }
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async upsertRecord(collection, id, record) {
      await pool.query(
        `INSERT INTO site_records (collection, id, data)
         VALUES ($1, $2, $3)
         ON CONFLICT (collection, id)
         DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
        [collection, id, record],
      );
    },

    async deleteRecord(collection, id) {
      await pool.query(
        "DELETE FROM site_records WHERE collection = $1 AND id = $2",
        [collection, id],
      );
    },

    async readDocument(key) {
      const { rows } = await pool.query<{ value: unknown }>(
        "SELECT value FROM site_documents WHERE key = $1",
        [key],
      );
      return rows[0]?.value ?? null;
    },

    async writeDocument(key, value) {
      await pool.query(
        `INSERT INTO site_documents (key, value)
         VALUES ($1, $2)
         ON CONFLICT (key)
         DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, value],
      );
    },

    async saveFile(name, mime, bytes) {
      await pool.query(
        `INSERT INTO site_files (name, mime, bytes)
         VALUES ($1, $2, $3)
         ON CONFLICT (name)
         DO UPDATE SET mime = EXCLUDED.mime, bytes = EXCLUDED.bytes`,
        [name, mime, bytes],
      );
    },

    async readFile(name): Promise<StoredFile | null> {
      const { rows } = await pool.query<{ mime: string; bytes: Buffer }>(
        "SELECT mime, bytes FROM site_files WHERE name = $1",
        [name],
      );
      return rows[0] ? { mime: rows[0].mime, bytes: rows[0].bytes } : null;
    },

    async deleteFile(name) {
      await pool.query("DELETE FROM site_files WHERE name = $1", [name]);
    },
  };
}
