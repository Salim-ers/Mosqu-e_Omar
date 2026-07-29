import "server-only";

/**
 * ============================================================================
 * CONTRAT DE STOCKAGE
 * ----------------------------------------------------------------------------
 * Tout ce que l'application sait faire d'un contenu passe par cette interface.
 * Deux implémentations la remplissent :
 *
 *  – `driver-fs`       : fichiers JSON dans un dossier de données. Aucun
 *                        service à installer — parfait en développement et sur
 *                        un hébergement à disque persistant.
 *  – `driver-postgres` : Postgres (Supabase, Neon…). Le choix pour un
 *                        hébergement sans disque persistant, Vercel en tête.
 *
 * Le driver est choisi à partir de l'environnement : dès qu'une URL de base de
 * données est fournie, c'est Postgres ; sinon, les fichiers.
 * ============================================================================
 */

export type StoredFile = { mime: string; bytes: Buffer };

export type StoreDriver = {
  /** Nom lisible, affiché dans l'espace bénévoles. */
  readonly label: string;

  /** Tous les enregistrements d'une collection, dans l'ordre d'insertion. */
  readCollection(collection: string): Promise<unknown[]>;
  /**
   * Compteurs de plusieurs collections en une seule interrogation : total, et
   * nombre d'enregistrements dont le drapeau booléen `flag` n'est pas vrai
   * (brouillons pour `published`, messages non lus pour `read`).
   *
   * L'espace bénévoles affiche ces compteurs à chaque page : les obtenir en
   * lisant chaque rubrique entière coûtait dix allers-retours par clic.
   */
  collectionStats(
    collections: string[],
    flag: string,
  ): Promise<Record<string, { total: number; without: number }>>;

  /**
   * Les `limit` enregistrements les plus récents d'une collection, triés sur
   * une date portée par le contenu. Évite de rapatrier tout un journal pour
   * n'en afficher que les huit dernières lignes.
   */
  readRecent(collection: string, dateKey: string, limit: number): Promise<unknown[]>;
  /** Crée ou remplace un enregistrement. */
  upsertRecord(collection: string, id: string, record: unknown): Promise<void>;
  deleteRecord(collection: string, id: string): Promise<void>;
  /** Remplace toute une collection (import initial). */
  writeCollection(collection: string, records: unknown[]): Promise<void>;

  /** Documents uniques : réglages, secret de session. */
  readDocument(key: string): Promise<unknown | null>;
  writeDocument(key: string, value: unknown): Promise<void>;

  /** Fichiers envoyés depuis l'admin. */
  saveFile(name: string, mime: string, bytes: Buffer): Promise<void>;
  readFile(name: string): Promise<StoredFile | null>;
  deleteFile(name: string): Promise<void>;
};

/** URL de base de données, quel que soit le nom donné par l'hébergeur. */
export function databaseUrl(): string | null {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.SUPABASE_DB_URL,
  ];
  const url = candidates.find((value) => value && value.trim().length > 0);
  return url ? url.trim() : null;
}

let instance: Promise<StoreDriver> | null = null;

/** Driver actif — instancié une seule fois par processus. */
export function driver(): Promise<StoreDriver> {
  if (!instance) {
    instance = databaseUrl()
      ? import("@/lib/store/driver-postgres").then((m) => m.createPostgresDriver())
      : import("@/lib/store/driver-fs").then((m) => m.createFsDriver());
  }
  return instance;
}
