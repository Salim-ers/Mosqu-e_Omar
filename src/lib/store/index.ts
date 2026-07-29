import "server-only";

import { randomUUID } from "node:crypto";
import { cache } from "react";

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

/**
 * Lecture d'une collection, mise en cache pour la durée d'un rendu : la mise
 * en page de l'espace bénévoles et la page qu'elle contient demandent souvent
 * les mêmes contenus, et sans cela chacune interrogerait la base de son côté.
 */
const readCollectionOnce = cache(
  async (name: string): Promise<unknown[]> => (await driver()).readCollection(name),
);

export async function readCollection<K extends CollectionName>(
  name: K,
): Promise<Collections[K][]> {
  return (await readCollectionOnce(name)) as Collections[K][];
}

/**
 * Compteurs de plusieurs collections, en une seule interrogation : total et
 * nombre d'enregistrements dont le drapeau n'est pas levé (brouillons pour
 * « published », messages non lus pour « read »).
 */
export const collectionStats = cache(
  async (
    names: readonly CollectionName[],
    flag: string,
  ): Promise<Record<string, { total: number; without: number }>> =>
    (await driver()).collectionStats([...names], flag),
);

/** Les `limit` enregistrements les plus récents, triés sur une date. */
export const readRecent = cache(
  async <K extends CollectionName>(
    name: K,
    dateKey: string,
    limit: number,
  ): Promise<Collections[K][]> =>
    (await (await driver()).readRecent(name, dateKey, limit)) as Collections[K][],
);

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
