import "server-only";

import { randomUUID } from "node:crypto";

import { databaseUrl, driver } from "@/lib/store/driver";
import type { CollectionName, Collections, Reglages } from "@/lib/store/types";

/**
 * ============================================================================
 * STOCKAGE DES CONTENUS — API unique
 * ----------------------------------------------------------------------------
 * Le reste de l'application ne connaît que ces fonctions ; le choix entre
 * fichiers et base de données se fait dans `driver.ts`, à partir de
 * l'environnement. Changer d'hébergement ne demande donc aucune modification
 * ailleurs dans le code.
 * ============================================================================
 */

/** Nom du mode de stockage actif, affiché dans l'espace bénévoles. */
export async function storageLabel(): Promise<string> {
  return (await driver()).label;
}

export function usesDatabase(): boolean {
  return databaseUrl() !== null;
}

/* ------------------------------------------------------- collections --- */

export async function readCollection<K extends CollectionName>(
  name: K,
): Promise<Collections[K][]> {
  const list = await (await driver()).readCollection(name);
  return list as Collections[K][];
}

export async function writeCollection<K extends CollectionName>(
  name: K,
  items: Collections[K][],
): Promise<void> {
  await (await driver()).writeCollection(name, items);
}

export async function findRecord<K extends CollectionName>(
  name: K,
  id: string,
): Promise<Collections[K] | null> {
  const list = await readCollection(name);
  return list.find((item) => item.id === id) ?? null;
}

export async function upsertRecord<K extends CollectionName>(
  name: K,
  record: Collections[K],
): Promise<Collections[K]> {
  await (await driver()).upsertRecord(name, record.id, record);
  return record;
}

export async function deleteRecord<K extends CollectionName>(
  name: K,
  id: string,
): Promise<void> {
  await (await driver()).deleteRecord(name, id);
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
  const stored = (await (await driver()).readDocument(
    "reglages",
  )) as Partial<Reglages> | null;
  return { ...DEFAULT_REGLAGES, ...(stored ?? {}) };
}

export async function writeReglages(value: Reglages): Promise<void> {
  await (await driver()).writeDocument("reglages", value);
}

/* ------------------------------------------------------------ fichiers --- */

export async function saveFile(
  name: string,
  mime: string,
  bytes: Buffer,
): Promise<void> {
  await (await driver()).saveFile(name, mime, bytes);
}

export async function readFile(name: string) {
  return (await driver()).readFile(name);
}

export async function deleteFile(name: string): Promise<void> {
  await (await driver()).deleteFile(name);
}

/* -------------------------------------------------------------- divers --- */

export function newId(): string {
  return randomUUID();
}

/**
 * Secret de signature des sessions. Fourni par l'environnement en production ;
 * à défaut, généré une fois et conservé avec les contenus — de sorte que les
 * sessions survivent à un redémarrage même sans configuration.
 */
export async function readOrCreateSecret(): Promise<string> {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;

  const store = await driver();
  const existing = (await store.readDocument("auth-secret")) as
    | { secret?: string }
    | null;
  if (existing?.secret && existing.secret.length >= 32) return existing.secret;

  const secret =
    randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
  await store.writeDocument("auth-secret", { secret });
  return secret;
}
