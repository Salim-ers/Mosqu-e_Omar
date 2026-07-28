import "server-only";

import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import type { StoreDriver, StoredFile } from "@/lib/store/driver";

/**
 * ============================================================================
 * STOCKAGE FICHIERS
 * ----------------------------------------------------------------------------
 * Un fichier JSON par collection dans le dossier de données (`.data` par
 * défaut, ou `DATA_DIR`), les photos dans `.data/uploads`.
 *
 * Écriture atomique — fichier temporaire puis renommage — et file d'attente
 * par fichier : deux bénévoles qui enregistrent en même temps ne peuvent pas
 * se faire perdre leurs modifications.
 *
 * ⚠️ Suppose un disque persistant. Sur un hébergement serverless, fournir une
 * URL de base de données pour basculer sur le driver Postgres.
 * ============================================================================
 */

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), ".data");

const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const MIMES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export function createFsDriver(): StoreDriver {
  const queues = new Map<string, Promise<unknown>>();

  /** Sérialise les opérations portant sur un même fichier. */
  function serialize<T>(key: string, task: () => Promise<T>): Promise<T> {
    const previous = queues.get(key) ?? Promise.resolve();
    const next = previous.then(task, task);
    queues.set(
      key,
      next.catch(() => undefined),
    );
    return next;
  }

  const fileOf = (name: string) => path.join(DATA_DIR, `${name}.json`);

  async function readJson<T>(file: string, fallback: T): Promise<T> {
    try {
      return JSON.parse(await readFile(file, "utf8")) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
      // Fichier illisible : on ne casse pas le site public pour autant.
      console.error(`[store] lecture impossible de ${file}`, error);
      return fallback;
    }
  }

  async function writeJson(file: string, value: unknown): Promise<void> {
    await mkdir(path.dirname(file), { recursive: true });
    const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    await rename(temp, file);
  }

  type Row = { id?: string };

  return {
    label: "fichiers",

    async readCollection(collection) {
      const list = await readJson<unknown[]>(fileOf(collection), []);
      return Array.isArray(list) ? list : [];
    },

    async writeCollection(collection, records) {
      await serialize(collection, () => writeJson(fileOf(collection), records));
    },

    async upsertRecord(collection, id, record) {
      await serialize(collection, async () => {
        const list = await readJson<Row[]>(fileOf(collection), []);
        const index = list.findIndex((item) => item?.id === id);
        if (index >= 0) list[index] = record as Row;
        else list.push(record as Row);
        await writeJson(fileOf(collection), list);
      });
    },

    async deleteRecord(collection, id) {
      await serialize(collection, async () => {
        const list = await readJson<Row[]>(fileOf(collection), []);
        await writeJson(
          fileOf(collection),
          list.filter((item) => item?.id !== id),
        );
      });
    },

    async readDocument(key) {
      const value = await readJson<unknown | null>(fileOf(key), null);
      return value;
    },

    async writeDocument(key, value) {
      await serialize(key, () => writeJson(fileOf(key), value));
    },

    async saveFile(name, _mime, bytes) {
      await mkdir(UPLOADS_DIR, { recursive: true });
      await writeFile(path.join(UPLOADS_DIR, path.basename(name)), bytes);
    },

    async readFile(name): Promise<StoredFile | null> {
      const safe = path.basename(name);
      const mime = MIMES[path.extname(safe).toLowerCase()];
      if (!mime) return null;
      try {
        return { mime, bytes: await readFile(path.join(UPLOADS_DIR, safe)) };
      } catch {
        return null;
      }
    },

    async deleteFile(name) {
      try {
        await unlink(path.join(UPLOADS_DIR, path.basename(name)));
      } catch {
        /* fichier déjà absent — rien à faire */
      }
    },
  };
}
