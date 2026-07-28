/**
 * ============================================================================
 * MODÈLE DE CONTENU ÉDITABLE — espace bénévoles
 * ----------------------------------------------------------------------------
 * Tout ce que l'association peut modifier depuis /admin sans toucher au code.
 * Chaque enregistrement est un objet JSON simple, versionné par `updatedAt`.
 * ============================================================================
 */

/** Champs communs à tous les enregistrements gérés depuis l'admin. */
export type BaseRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  /** Un contenu non publié reste invisible du public (brouillon). */
  published: boolean;
  /** Ordre d'affichage manuel (plus petit = plus haut). */
  order?: number;
};

/** Une image de la bibliothèque, référencée par son URL publique. */
export type ImageRef = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

/* ----------------------------------------------------------- annonces --- */

export type AnnonceRecord = BaseRecord & {
  title: string;
  body: string;
  href: string;
  hrefLabel: string;
  publishedAt: string;
  startsAt: string;
  endsAt: string;
  isPinned: boolean;
};

/* --------------------------------------------------------- actualités --- */

export type ArticleRecord = BaseRecord & {
  title: string;
  slug: string;
  excerpt: string;
  /** Texte rédigé en « écriture simple » (voir src/lib/richtext.ts). */
  body: string;
  cover: ImageRef | null;
  publishedAt: string;
};

/* ------------------------------------------------------------- janaza --- */

/**
 * Annonce de prière funéraire. Contenu sensible : volontairement sobre, et
 * masqué automatiquement quelques jours après la prière (`hideAfterDays`).
 */
export type JanazaRecord = BaseRecord & {
  /** Nom du défunt tel que l'association souhaite l'annoncer. */
  name: string;
  /** Date et heure de la prière (ISO local, ex. 2026-08-02T14:30). */
  prayerAt: string;
  /** Lieu de la prière — par défaut la mosquée. */
  place: string;
  /** Cimetière / lieu d'inhumation (facultatif). */
  burialPlace: string;
  note: string;
  hideAfterDays: number;
};

/* --------------------------------------------------------- événements --- */

export type EvenementKind =
  | "aid"
  | "ramadan"
  | "conference"
  | "collecte"
  | "repas"
  | "autre";

export type EvenementRecord = BaseRecord & {
  title: string;
  kind: EvenementKind;
  /** Date de début (ISO local). */
  startsAt: string;
  /** Date de fin — facultative (événement sur plusieurs jours). */
  endsAt: string;
  /** Horaire affiché en toutes lettres si la date seule ne suffit pas. */
  timeLabel: string;
  place: string;
  description: string;
  image: ImageRef | null;
  href: string;
  hrefLabel: string;
  isHighlighted: boolean;
};

/* ---------------------------------------------------------- activités --- */

export type ActiviteRecord = BaseRecord & {
  title: string;
  slug: string;
  kicker: string;
  summary: string;
  points: string[];
  detail: string;
  audience: string;
  image: ImageRef | null;
};

/* ----------------------------------------------------------- services --- */

export type ServiceRecord = BaseRecord & {
  label: string;
  note: string;
};

/* ------------------------------------------------------------- albums --- */

export type AlbumRecord = BaseRecord & {
  title: string;
  date: string;
  description: string;
  photos: ImageRef[];
};

/* ------------------------------------------------------- inscriptions --- */

export type InscriptionStatus = "OPEN" | "COMING_SOON" | "CLOSED";

export type InscriptionRecord = BaseRecord & {
  label: string;
  status: InscriptionStatus;
  note: string;
};

/* ------------------------------------------------------------ médias --- */

export type MediaRecord = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
  uploadedBy: string;
};

/* --------------------------------------------------------- réglages --- */

export type Reglages = {
  /** Horaire de la Jumu‘a affiché sur le site — vide = masqué. */
  jumua: string;
  /** Bandeau d'information affiché en haut du site (vide = aucun). */
  bannerText: string;
  bannerHref: string;
  bannerActive: boolean;
  contactPhone: string;
  contactEmail: string;
  addressStreet: string;
  addressPostalCode: string;
  addressCity: string;
  donationUrl: string;
  monthlyDonationUrl: string;
  socials: { label: string; href: string }[];
  updatedAt: string;
};

/* ---------------------------------------------------------- messages --- */

/** Message reçu via le formulaire de contact du site. */
export type MessageRecord = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  body: string;
  /** Passe à vrai dès qu'un bénévole a ouvert le message. */
  read: boolean;
};

/* ----------------------------------------------------------- journal --- */

export type JournalAction =
  | "creation"
  | "modification"
  | "suppression"
  | "publication"
  | "depublication"
  | "reglages"
  | "compte"
  | "import"
  | "connexion"
  | "message";

/** Une ligne du journal : qui a fait quoi, sur quoi, et quand. */
export type JournalRecord = {
  id: string;
  at: string;
  userId: string;
  userName: string;
  action: JournalAction;
  /** Rubrique concernée, en toutes lettres. */
  scope: string;
  /** Élément concerné, en toutes lettres. */
  label: string;
};

/* --------------------------------------------------------- comptes --- */

export type UserRole = "admin" | "editeur";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  /** Empreinte scrypt — jamais le mot de passe en clair. */
  passwordHash: string;
  createdAt: string;
  lastLoginAt: string | null;
  active: boolean;
};

/* ----------------------------------------------------------- mapping --- */

export type Collections = {
  annonces: AnnonceRecord;
  actualites: ArticleRecord;
  janaza: JanazaRecord;
  evenements: EvenementRecord;
  activites: ActiviteRecord;
  services: ServiceRecord;
  albums: AlbumRecord;
  inscriptions: InscriptionRecord;
  medias: MediaRecord;
  messages: MessageRecord;
  journal: JournalRecord;
  utilisateurs: UserRecord;
};

export type CollectionName = keyof Collections;
