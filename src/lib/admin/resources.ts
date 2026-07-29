import type { CollectionName } from "@/lib/store/types";

/**
 * ============================================================================
 * DESCRIPTION DES CONTENUS ÉDITABLES
 * ----------------------------------------------------------------------------
 * Source unique de vérité de l'espace bénévoles : chaque rubrique de /admin
 * (liste, formulaire, validation, libellés) est engendrée à partir de cette
 * description. Ajouter un champ ici suffit à le faire apparaître dans
 * l'interface — aucun formulaire n'est écrit à la main.
 * ============================================================================
 */

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "slug"
  | "date"
  | "datetime"
  | "number"
  | "boolean"
  | "select"
  | "list"
  | "image"
  | "images";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Champ occupant toute la largeur du formulaire. */
  full?: boolean;
  /** Valeur par défaut d'un nouvel enregistrement. */
  defaultValue?: string | number | boolean;
  /** Champ `slug` : nom du champ dont il dérive automatiquement. */
  from?: string;
};

export type ResourceDef = {
  key: Exclude<
    CollectionName,
    "medias" | "messages" | "inscrits" | "utilisateurs"
  >;
  /** Libellé de la rubrique — « Actualités ». */
  label: string;
  /** Un élément — « une actualité ». */
  singular: string;
  /** Verbe d'action — « Nouvelle actualité ». */
  newLabel: string;
  description: string;
  fields: Field[];
  /** Champ affiché comme titre dans la liste. */
  titleField: string;
  /** Champ secondaire affiché sous le titre. */
  subtitleField?: string;
  /** Champ date utilisé pour le tri et la colonne « date ». */
  dateField?: string;
  /** Rubrique dont l'ordre d'affichage est réglé à la main. */
  sortable?: boolean;
  /** Rubrique dont les éléments ne se suppriment pas à la légère. */
  sensitive?: boolean;
};

const IMAGE_HELP = "Format paysage conseillé. L’image est réduite automatiquement.";

export const RESOURCES: ResourceDef[] = [
  {
    key: "annonces",
    label: "Annonces",
    singular: "une annonce",
    newLabel: "Nouvelle annonce",
    description:
      "Messages courts affichés en page d’accueil. Une annonce disparaît toute seule après sa date de fin.",
    titleField: "title",
    subtitleField: "body",
    dateField: "publishedAt",
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      {
        name: "body",
        label: "Message",
        type: "textarea",
        full: true,
        help: "Deux ou trois phrases suffisent.",
      },
      {
        name: "publishedAt",
        label: "Date de publication",
        type: "date",
        required: true,
      },
      {
        name: "endsAt",
        label: "Retirer après le",
        type: "date",
        help: "L’annonce disparaît automatiquement de l’accueil après cette date.",
      },
      {
        name: "startsAt",
        label: "Afficher à partir du",
        type: "date",
        help: "Facultatif — pour programmer une annonce à l’avance.",
      },
      {
        name: "isPinned",
        label: "Mettre à la une",
        type: "boolean",
        help: "L’annonce passe en tête de liste.",
      },
      {
        name: "href",
        label: "Lien",
        type: "text",
        placeholder: "/projet ou https://…",
        help: "Facultatif — page vers laquelle pointe l’annonce.",
      },
      {
        name: "hrefLabel",
        label: "Texte du lien",
        type: "text",
        placeholder: "En savoir plus",
      },
    ],
  },
  {
    key: "actualites",
    label: "Actualités",
    singular: "une actualité",
    newLabel: "Nouvel article",
    description:
      "Articles complets publiés sur la page Actualités, avec photo et texte mis en forme.",
    titleField: "title",
    subtitleField: "excerpt",
    dateField: "publishedAt",
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      {
        name: "slug",
        label: "Adresse de la page",
        type: "slug",
        from: "title",
        help: "Se remplit toute seule à partir du titre.",
      },
      {
        name: "publishedAt",
        label: "Date de publication",
        type: "date",
        required: true,
      },
      {
        name: "excerpt",
        label: "Résumé",
        type: "textarea",
        full: true,
        help: "Une ou deux phrases affichées dans la liste des actualités.",
      },
      { name: "cover", label: "Photo de couverture", type: "image", full: true, help: IMAGE_HELP },
      { name: "body", label: "Texte de l’article", type: "richtext", full: true },
    ],
  },
  {
    key: "janaza",
    label: "Janaza",
    singular: "une annonce de janaza",
    newLabel: "Nouvelle annonce de janaza",
    description:
      "Annonces de prière funéraire. Sobres par nature, elles se retirent d’elles-mêmes quelques jours après la prière.",
    titleField: "name",
    subtitleField: "place",
    dateField: "prayerAt",
    sensitive: true,
    fields: [
      {
        name: "name",
        label: "Nom du défunt",
        type: "text",
        required: true,
        full: true,
        help: "Écrivez le nom exactement comme la famille souhaite qu’il soit annoncé.",
      },
      {
        name: "prayerAt",
        label: "Date et heure de la prière",
        type: "datetime",
        required: true,
      },
      {
        name: "place",
        label: "Lieu de la prière",
        type: "text",
        defaultValue: "Mosquée Omar Ibn al Khattab — Creil",
      },
      {
        name: "burialPlace",
        label: "Lieu de l’inhumation",
        type: "text",
        help: "Facultatif.",
      },
      {
        name: "hideAfterDays",
        label: "Retirer après (jours)",
        type: "number",
        defaultValue: 7,
        help: "Nombre de jours après la prière au bout desquels l’annonce disparaît.",
      },
      {
        name: "note",
        label: "Précision",
        type: "textarea",
        full: true,
        help: "Facultatif — une phrase, par exemple les conditions d’accès.",
      },
    ],
  },
  {
    key: "evenements",
    label: "Événements",
    singular: "un événement",
    newLabel: "Nouvel événement",
    description:
      "Aïd, iftars, conférences, collectes… Les événements passés basculent automatiquement dans les archives.",
    titleField: "title",
    subtitleField: "place",
    dateField: "startsAt",
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      {
        name: "kind",
        label: "Type d’événement",
        type: "select",
        defaultValue: "autre",
        options: [
          { value: "aid", label: "Aïd" },
          { value: "ramadan", label: "Ramadan" },
          { value: "conference", label: "Conférence / rappel" },
          { value: "collecte", label: "Collecte" },
          { value: "repas", label: "Repas / iftar" },
          { value: "autre", label: "Autre" },
        ],
      },
      {
        name: "startsAt",
        label: "Date et heure",
        type: "datetime",
        required: true,
      },
      {
        name: "endsAt",
        label: "Fin",
        type: "datetime",
        help: "Facultatif — pour un événement sur plusieurs jours.",
      },
      {
        name: "timeLabel",
        label: "Horaire en toutes lettres",
        type: "text",
        placeholder: "Prière à 9 h 00 — accueil dès 8 h 15",
        help: "Facultatif — s’affiche à la place de l’heure exacte.",
      },
      {
        name: "place",
        label: "Lieu",
        type: "text",
        defaultValue: "Mosquée Omar Ibn al Khattab — Creil",
      },
      {
        name: "isHighlighted",
        label: "Mettre en avant",
        type: "boolean",
        help: "L’événement est affiché en grand sur la page Événements.",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        full: true,
      },
      { name: "image", label: "Photo / affiche", type: "image", full: true, help: IMAGE_HELP },
      {
        name: "href",
        label: "Lien",
        type: "text",
        placeholder: "https://…",
        help: "Facultatif — inscription, billetterie, page de don…",
      },
      { name: "hrefLabel", label: "Texte du lien", type: "text", placeholder: "S’inscrire" },
    ],
  },
  {
    key: "activites",
    label: "Activités",
    singular: "une activité",
    newLabel: "Nouvelle activité",
    description:
      "Cours de Coran, arabe, soutien scolaire… Chaque activité a sa propre page sur le site.",
    titleField: "title",
    subtitleField: "summary",
    sortable: true,
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, full: true },
      { name: "slug", label: "Adresse de la page", type: "slug", from: "title" },
      {
        name: "kicker",
        label: "Surtitre",
        type: "text",
        placeholder: "Apprentissage & mémorisation",
      },
      {
        name: "audience",
        label: "Public",
        type: "text",
        placeholder: "Enfants · Adolescents · Adultes",
      },
      { name: "summary", label: "Résumé", type: "textarea", full: true },
      {
        name: "points",
        label: "Ce que l’on y apprend",
        type: "list",
        full: true,
        help: "Un élément par ligne.",
      },
      { name: "detail", label: "Texte complémentaire", type: "textarea", full: true },
      { name: "image", label: "Photo", type: "image", full: true, help: IMAGE_HELP },
    ],
  },
  {
    key: "services",
    label: "Services",
    singular: "un service",
    newLabel: "Nouveau service",
    description:
      "La liste des services pratiques affichée en page d’accueil (espace femmes, ablutions, accès PMR…).",
    titleField: "label",
    subtitleField: "note",
    sortable: true,
    fields: [
      { name: "label", label: "Service", type: "text", required: true },
      { name: "note", label: "Précision", type: "text", full: true },
    ],
  },
  {
    key: "albums",
    label: "Photos & albums",
    singular: "un album",
    newLabel: "Nouvel album",
    description:
      "Les photos des événements de la mosquée, regroupées par album et affichées dans la galerie.",
    titleField: "title",
    subtitleField: "description",
    dateField: "date",
    sortable: true,
    fields: [
      { name: "title", label: "Titre de l’album", type: "text", required: true, full: true },
      { name: "date", label: "Date", type: "date" },
      { name: "description", label: "Description", type: "textarea", full: true },
      {
        name: "photos",
        label: "Photos",
        type: "images",
        full: true,
        help: "Ajoutez autant de photos que vous le souhaitez — glissez-les ou choisissez-les depuis votre téléphone.",
      },
    ],
  },
  {
    key: "inscriptions",
    label: "Inscriptions",
    singular: "une inscription",
    newLabel: "Nouvelle ligne d’inscription",
    description:
      "L’état des inscriptions affiché sur la page Inscriptions : ouvertes, prochainement, ou closes.",
    titleField: "label",
    subtitleField: "note",
    sortable: true,
    fields: [
      { name: "label", label: "Intitulé", type: "text", required: true },
      {
        name: "status",
        label: "Statut",
        type: "select",
        defaultValue: "OPEN",
        options: [
          { value: "OPEN", label: "Inscriptions ouvertes" },
          { value: "COMING_SOON", label: "Ouverture prochaine" },
          { value: "CLOSED", label: "Inscriptions closes" },
        ],
      },
      { name: "note", label: "Précision", type: "textarea", full: true },
    ],
  },
];

export function getResource(key: string): ResourceDef | undefined {
  return RESOURCES.find((r) => r.key === key);
}

/** Fabrique un identifiant d'URL lisible à partir d'un titre. */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'"]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
