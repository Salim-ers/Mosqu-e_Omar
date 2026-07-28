import type { Announcement } from "@/lib/announcements";

/**
 * Annonces locales curées. Chaque entrée est datée : passée `endsAt`, elle
 * disparaît automatiquement de l'accueil (elle reste visible dans les
 * archives de la page Actualités, clairement marquée comme passée).
 *
 * Faits sourcés depuis le site actuel (juillet 2026).
 */
export const LOCAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ouverture-nouvelle-mosquee-2026",
    title: "La nouvelle mosquée est ouverte",
    body:
      "Al hamdoulillah — grâce à vos dons, la mosquée Omar a ouvert ses portes pour le Ramadan 2026. Les aménagements extérieurs (façades, parking, espaces verts) se poursuivent.",
    href: "/projet",
    hrefLabel: "Découvrir la nouvelle mosquée",
    publishedAt: "2026-02-15T08:00:00+01:00",
    endsAt: "2026-10-01T00:00:00+02:00",
    isPinned: true,
    tone: "standard",
  },
  /*
   * Exemple d'annonce programmée (décommentez et adaptez) :
   * {
   *   id: "horaire-icha-hiver",
   *   title: "Horaire d’Icha en période hivernale",
   *   body: "La prière d’Icha est fixée à 19 h durant la période hivernale.",
   *   publishedAt: "2026-10-20T08:00:00+02:00",
   *   startsAt: "2026-10-25T00:00:00+02:00",
   *   endsAt: "2027-03-28T00:00:00+02:00",
   * },
   */
];
