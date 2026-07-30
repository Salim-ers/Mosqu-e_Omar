/**
 * ============================================================================
 * CONFIGURATION CENTRALE DU SITE
 * ----------------------------------------------------------------------------
 * Source unique de vérité pour toutes les informations de la mosquée.
 * Toutes les données ci-dessous proviennent de l'audit du site actuel
 * (mosqueeomarcreil.fr) et de la fiche MAWAQIT officielle — juillet 2026.
 * Aucune information ne doit être dupliquée ailleurs dans le code.
 * ============================================================================
 */

export const site = {
  name: "Mosquée Omar Ibn al Khattab",
  shortName: "Mosquée Omar — Creil",
  longName: "Mosquée Omar Ibn al Khattab — Creil",
  /** Nom de la mosquée en arabe (fait vérifiable — nom propre). */
  arabicName: "مسجد عمر بن الخطاب",
  association: {
    acronym: "ACCMPR",
    /** Libellé utilisé sur la page « À propos » du site actuel. */
    description: "Institut culturel et cultuel",
    foundedYear: 2013,
    siret: "798 305 280 00025",
  },

  /**
   * Adresse publique, toujours sans barre oblique finale : elle est concaténée
   * telle quelle (plan du site, robots.txt, données structurées). Une variable
   * d'environnement copiée depuis un navigateur se termine presque toujours
   * par « / », ce qui donnait « …/​/sitemap.xml ».
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mosqueeomarcreil.fr")
    .trim()
    .replace(/\/+$/, ""),

  /**
   * ADRESSE — ⚠️ TODO VALIDATION HUMAINE AVANT MISE EN PRODUCTION.
   * Le site actuel affiche deux orthographes :
   *   – « 1 Rue Larmartine » (texte du pied de page) ;
   *   – « 1 Rue Lamartine » (lien Google Maps + annuaires externes).
   * L'orthographe « Lamartine » (celle du lien Maps officiel) est retenue ici
   * par défaut. À confirmer par l'association, puis corriger si besoin —
   * uniquement à cet endroit.
   */
  address: {
    street: "1 rue Lamartine",
    postalCode: "60100",
    city: "Creil",
    region: "Oise — Hauts-de-France",
    country: "France",
    countryCode: "FR",
  },

  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "03 44 24 82 11",
    phoneHref: "tel:+33344248211",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "accmpr60@gmail.com",
  },

  /**
   * MAWAQIT — source officielle des horaires de prière de la mosquée.
   * Identifiants confirmés sur mawaqit.net (ID 6812, slug « omar-creil »).
   * Le site actuel intègre déjà la vue mobile /m/ : nous la réutilisons.
   */
  mawaqit: {
    mosqueId: 6812,
    slug: "omar-creil",
    pageUrl: "https://mawaqit.net/fr/omar-creil",
    embedUrl:
      process.env.NEXT_PUBLIC_MAWAQIT_EMBED_URL ??
      "https://mawaqit.net/fr/m/omar-creil",
    /**
     * JUMU‘A — « 13h15 » est l'horaire annoncé par la mosquée elle-même
     * (message officiel publié sur son écran MAWAQIT, relevé en 2026).
     * TODO : à faire confirmer par l'association à chaque changement
     * saisonnier. Mettre `null` pour masquer l'heure et n'afficher que le
     * renvoi vers MAWAQIT.
     */
    jumua: "13h15" as string | null,
  },

  /**
   * DONS — réutilisation du système existant (formulaire GiveWP sur la page
   * « Projet » du WordPress + page « Abonnement » pour le don mensuel).
   * La déduction fiscale de 66 % est celle annoncée par la mosquée sur sa
   * propre page de dons. TODO : faire confirmer le maintien de ce taux et le
   * reçu fiscal par l'association.
   */
  donation: {
    onlineUrl:
      process.env.NEXT_PUBLIC_DONATION_URL ??
      "https://mosqueeomarcreil.fr/projet",
    monthlyUrl:
      process.env.NEXT_PUBLIC_MONTHLY_DONATION_URL ??
      "https://mosqueeomarcreil.fr/abonnement",
    taxDeductionPercent: 66,
    /** Suggestion affichée sur la page de don mensuel actuelle. */
    monthlySuggestion: "20 € / mois",
    /** Le don en main propre est proposé sur place (page Projet actuelle). */
    inPerson: true,
  },

  map: {
    /** URL d'embed déjà utilisée par le site actuel. */
    embedUrl:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ??
      "https://www.google.com/maps?q=1+Rue+Lamartine,+60100+Creil&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=1+Rue+Lamartine%2C+60100+Creil",
  },

  /**
   * RÉSEAUX SOCIAUX — aucun compte officiel n'a été trouvé lors de l'audit.
   * TODO : compléter uniquement avec des comptes réellement gérés par
   * l'association. Tant que la liste est vide, rien n'est affiché.
   */
  socials: [] as { label: string; href: string }[],

  navigation: {
    main: [
      { label: "Accueil", href: "/" },
      { label: "Horaires", href: "/horaires" },
      { label: "Activités", href: "/activites" },
      { label: "La mosquée", href: "/projet" },
      { label: "Actualités", href: "/actualites" },
      { label: "L’association", href: "/a-propos" },
      { label: "Galerie", href: "/galerie" },
      { label: "Contact", href: "/contact" },
    ],
    secondary: [
      { label: "Événements", href: "/evenements" },
      { label: "Inscriptions", href: "/inscriptions" },
      { label: "Prières funéraires", href: "/janaza" },
      { label: "Faire un don", href: "/dons" },
    ],
    legal: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Politique de confidentialité", href: "/politique-confidentialite" },
    ],
  },
} as const;

export type Site = typeof site;

export function fullAddress(): string {
  return `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
}
