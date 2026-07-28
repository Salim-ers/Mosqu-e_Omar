import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CollectionName, Collections, Reglages } from "@/lib/store/types";

/**
 * ============================================================================
 * STOCKAGE DES CONTENUS — driver « fichiers »
 * ----------------------------------------------------------------------------
 * Les contenus édités par les bénévoles sont écrits dans un dossier de
 * données (par défaut `.data/`, hors du dépôt Git), un fichier JSON par
 * collection. Écriture atomique (fichier temporaire + renommage) et file
 * d'attente par collection : deux enregistrements simultanés ne peuvent pas
 * se perdre.
 *
 * ⚠️ Ce driver suppose un système de fichiers persistant (VPS, hébergeur
 * Node, conteneur avec volume). Sur un hébergement « serverless » à disque
 * éphémère, il faut monter un volume ou brancher un driver base de données —
 * toute l'application ne parle qu'à l'API ci-dessous.
 * ============================================================================
 */

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), ".data");

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

function fileOf(name: string): string {
  return path.join(DATA_DIR, `${name}.json`);
}

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

/** Files d'attente d'écriture, une par fichier. */
const queues = new Map<string, Promise<unknown>>();

function serialize<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve();
  const next = previous.then(task, task);
  queues.set(
    key,
    next.catch(() => undefined),
  );
  return next;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return fallback;
    // Fichier corrompu : on ne casse pas le site public pour autant.
    console.error(`[store] lecture impossible de ${file}`, error);
    return fallback;
  }
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await ensureDir(path.dirname(file));
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temp, file);
}

/* ------------------------------------------------------- collections --- */

export async function readCollection<K extends CollectionName>(
  name: K,
): Promise<Collections[K][]> {
  const list = await readJson<Collections[K][]>(fileOf(name), []);
  return Array.isArray(list) ? list : [];
}

export async function writeCollection<K extends CollectionName>(
  name: K,
  items: Collections[K][],
): Promise<void> {
  await serialize(name, () => writeJson(fileOf(name), items));
}

export async function findRecord<K extends CollectionName>(
  name: K,
  id: string,
): Promise<Collections[K] | null> {
  const list = await readCollection(name);
  return list.find((item) => item.id === id) ?? null;
}

/**
 * Crée ou met à jour un enregistrement. L'opération complète (lecture +
 * écriture) est sérialisée pour éviter toute perte de modification.
 */
export async function upsertRecord<K extends CollectionName>(
  name: K,
  record: Collections[K],
): Promise<Collections[K]> {
  return serialize(name, async () => {
    const list = await readJson<Collections[K][]>(fileOf(name), []);
    const index = list.findIndex((item) => item.id === record.id);
    if (index >= 0) list[index] = record;
    else list.push(record);
    await writeJson(fileOf(name), list);
    return record;
  });
}

export async function deleteRecord<K extends CollectionName>(
  name: K,
  id: string,
): Promise<void> {
  await serialize(name, async () => {
    const list = await readJson<Collections[K][]>(fileOf(name), []);
    await writeJson(
      fileOf(name),
      list.filter((item) => item.id !== id),
    );
  });
}

/* ---------------------------------------------------------- réglages --- */

export const DEFAULT_REGLAGES: Reglages = {
  jumua: "",
  bannerText: "",
  bannerHref: "",
  bannerActive: false,
  contactPhone: "",
  contactEmail: "",
  addressStreet: "",
  addressPostalCode: "",
  addressCity: "",
  donationUrl: "",
  monthlyDonationUrl: "",
  socials: [],
  updatedAt: "",
};

export async function readReglages(): Promise<Reglages> {
  const stored = await readJson<Partial<Reglages>>(fileOf("reglages"), {});
  return { ...DEFAULT_REGLAGES, ...stored };
}

export async function writeReglages(value: Reglages): Promise<void> {
  await serialize("reglages", () => writeJson(fileOf("reglages"), value));
}

/* ------------------------------------------------------------- divers --- */

export function newId(): string {
  return randomUUID();
}

/** Chemin d'un fichier de la médiathèque (jamais exposé au client). */
export async function ensureUploadsDir(): Promise<string> {
  await ensureDir(UPLOADS_DIR);
  return UPLOADS_DIR;
}

/** Secret de signature des sessions, généré une fois puis conservé. */
export async function readOrCreateSecret(): Promise<string> {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  const file = path.join(DATA_DIR, ".auth-secret");
  return serialize(".auth-secret", async () => {
    try {
      const existing = (await readFile(file, "utf8")).trim();
      if (existing.length >= 32) return existing;
    } catch {
      /* premier démarrage */
    }
    const secret = randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
    await ensureDir(DATA_DIR);
    await writeFile(file, secret, "utf8");
    return secret;
  });
}
