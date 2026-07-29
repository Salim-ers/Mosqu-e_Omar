import "server-only";

import { REGISTRATIONS } from "@/config/registrations";
import { ACTIVITIES } from "@/content/activities";
import { LOCAL_ANNOUNCEMENTS } from "@/content/announcements";
import { SERVICES } from "@/content/services";
import { GALLERY } from "@/lib/media";
import type { ResourceDef } from "@/lib/admin/resources";

/**
 * ============================================================================
 * CE QUE LE SITE AFFICHE DÉJÀ
 * ----------------------------------------------------------------------------
 * Une rubrique vide dans l'admin ne veut pas dire une rubrique vide sur le
 * site : tant que rien n'y est publié, le site continue d'afficher les
 * contenus livrés avec le code. Sans cette information, l'espace bénévoles
 * laisserait croire que le site est vide alors qu'il ne l'est pas.
 * ============================================================================
 */

export type ContenuDOrigine = {
  /** Nombre d'éléments actuellement affichés sur le site. */
  total: number;
  /** Ce que voit le visiteur, en une phrase. */
  description: string;
  /** Ces contenus peuvent-ils être repris en main d'un clic ? */
  importable: boolean;
};

export function contenuDOrigine(
  resource: ResourceDef["key"],
): ContenuDOrigine | null {
  switch (resource) {
    case "activites":
      return {
        total: ACTIVITIES.length,
        description: `Le site affiche les ${ACTIVITIES.length} activités d’origine : ${ACTIVITIES.map((a) => a.title).join(", ")}.`,
        importable: true,
      };

    case "services":
      return {
        total: SERVICES.length,
        description: `Le site affiche les ${SERVICES.length} services d’origine : ${SERVICES.map((s) => s.label).join(", ")}.`,
        importable: true,
      };

    case "inscriptions": {
      const entries = Object.values(REGISTRATIONS);
      return {
        total: entries.length,
        description: `Le site affiche les ${entries.length} lignes d’origine : ${entries.map((e) => e.label).join(", ")}.`,
        importable: true,
      };
    }

    case "annonces":
      return {
        total: LOCAL_ANNOUNCEMENTS.length,
        description:
          "Le site affiche les annonces d’origine, ainsi que celles publiées sur le WordPress dans la catégorie « annonces ».",
        importable: true,
      };

    case "actualites":
      return {
        total: 0,
        description:
          "La page Actualités affiche pour l’instant les articles du WordPress. Tout article publié ici passera devant.",
        importable: false,
      };

    case "albums":
      return {
        total: GALLERY.length,
        description: `La galerie affiche les ${GALLERY.length} photographies livrées avec le site (façade, salle de prière, chantier). Vos albums viendront se placer avant elles.`,
        importable: false,
      };

    case "evenements":
      return {
        total: 0,
        description:
          "La page Événements affiche les rendez-vous récurrents de l’année (Ramadan, Aïd, Jumu‘a, conférences). Vos événements datés s’afficheront au-dessus.",
        importable: false,
      };

    case "janaza":
      return {
        total: 0,
        description:
          "Aucune annonce de prière funéraire n’est visible sur le site — le bloc n’apparaît que lorsqu’il y en a une.",
        importable: false,
      };

    default:
      return null;
  }
}

/** Rubriques dont les contenus d'origine peuvent encore être repris en main. */
export function rubriquesImportables(
  compteurs: Record<string, number>,
): string[] {
  return (["activites", "services", "inscriptions", "annonces"] as const).filter(
    (key) => (compteurs[key] ?? 0) === 0,
  );
}
