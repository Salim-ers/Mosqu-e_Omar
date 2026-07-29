/**
 * ============================================================================
 * RÉFÉRENTIEL DES MÉDIAS — vraies photographies de la Mosquée Omar (Creil)
 * ----------------------------------------------------------------------------
 * Toutes les URLs ci-dessous proviennent de l'inventaire du WordPress actuel
 * (wp-content/uploads). Aucune photo d'une autre mosquée n'est utilisée.
 *
 * Stratégie d'assets :
 *  – `remote`   : URL vérifiée lors de l'audit (affichage garanti) ;
 *  – `original` : URL probable du fichier pleine résolution (WordPress
 *                 conserve l'original sans suffixe de taille) — utilisée par
 *                 le script `npm run media:download`, avec repli automatique
 *                 sur `remote` si l'original n'existe pas ;
 *  – `local`    : chemin public une fois les fichiers rapatriés.
 *
 * Passer NEXT_PUBLIC_USE_LOCAL_MEDIA=true après avoir exécuté le script pour
 * servir les images depuis /public/media (recommandé en production).
 *
 * TODO (validation humaine) : affiner les textes alternatifs après visionnage
 * des photographies — les descriptions ci-dessous restent volontairement
 * factuelles et générales.
 * ============================================================================
 */

const WP = process.env.WORDPRESS_BASE_URL ?? "https://mosqueeomarcreil.fr";
/**
 * Les photographies ont été rapatriées dans public/media : elles sont servies
 * par le site lui-même. Mettre NEXT_PUBLIC_USE_LOCAL_MEDIA=false pour repasser
 * aux fichiers du WordPress (utile si une photo y est mise à jour et qu'on
 * n'a pas encore relancé npm run media:download).
 */
const USE_LOCAL = process.env.NEXT_PUBLIC_USE_LOCAL_MEDIA !== "false";

export type Photo = {
  key: string;
  remote: string;
  original: string;
  local: string;
  width: number;
  height: number;
  alt: string;
};

function photo(
  key: string,
  path: string,
  sized: string | null,
  width: number,
  height: number,
  alt: string,
): Photo {
  const original = `${WP}/wp-content/uploads/${path}`;
  const remote = sized ? `${WP}/wp-content/uploads/${sized}` : original;
  const ext = path.slice(path.lastIndexOf("."));
  return {
    key,
    remote,
    original,
    local: `/media/${key}${ext}`,
    width,
    height,
    alt,
  };
}

/**
 * Photographie livrée avec le site (dossier `public/media`). Servie depuis le
 * nouveau site quelle que soit la valeur de NEXT_PUBLIC_USE_LOCAL_MEDIA : elle
 * ne dépend d'aucun WordPress.
 */
function shippedPhoto(
  key: string,
  file: string,
  width: number,
  height: number,
  alt: string,
): Photo {
  const url = `/media/${file}`;
  return { key, remote: url, original: url, local: url, width, height, alt };
}

export const PHOTOS = {
  /** Photographie principale : la façade de la nouvelle mosquée, de nuit. */
  facade: shippedPhoto(
    "facade-nuit",
    "facade-nuit.jpg",
    3344,
    1882,
    "La façade de la nouvelle mosquée Omar Ibn al Khattab à Creil, éclairée à la tombée de la nuit",
  ),
  /** Salle de prière — photographie publiée par la mosquée. */
  interieur: photo(
    "interieur",
    "2026/02/IMG_1068.jpeg",
    null,
    1600,
    1200,
    "La salle de prière de la mosquée Omar Ibn al Khattab à Creil",
  ),
  /* --- Illustrations des activités ---------------------------------------
     Œuvres du domaine public (CC0) issues de collections de musées : folio
     coranique koufique et page enluminée, panneau de calligraphie en
     céramique de Damas, lampe de mosquée. Aucune photographie d'une autre
     mosquée, aucune personne représentée. Libres de tout droit et de toute
     attribution. */
  activiteCoran: shippedPhoto(
    "activite-coran",
    "activite-coran.jpg",
    1200,
    1600,
    "Folio d’un Coran manuscrit en écriture koufique, IXe siècle",
  ),
  activiteDourous: shippedPhoto(
    "activite-dourous",
    "activite-dourous.jpg",
    1200,
    1600,
    "Page d’ouverture enluminée d’un recueil de hadiths",
  ),
  activiteArabe: shippedPhoto(
    "activite-arabe",
    "activite-arabe.jpg",
    1200,
    1600,
    "Panneau de calligraphie arabe en céramique, Damas, XVIe siècle",
  ),
  activiteSoutien: shippedPhoto(
    "activite-soutien",
    "activite-soutien.jpg",
    1200,
    1600,
    "Un cahier ouvert et un crayon posés sur une table",
  ),
  activiteCommunaute: shippedPhoto(
    "activite-communaute",
    "activite-communaute.jpg",
    1200,
    1600,
    "Lampe de mosquée en verre émaillé, décor de calligraphie bleue et or",
  ),

  chantier: photo(
    "chantier",
    "2026/02/IMG_1069.jpeg",
    "2026/02/IMG_1069-1024x663.jpeg",
    1024,
    663,
    "Le chantier de la nouvelle mosquée Omar à Creil",
  ),
  galerie1: photo(
    "galerie-1",
    "2026/03/IMG_2690.jpeg",
    "2026/03/IMG_2690-1024x768.jpeg",
    1024,
    768,
    "La mosquée Omar de Creil — photographie de la galerie officielle",
  ),
  galerie2: photo(
    "galerie-2",
    "2026/03/IMG_2689.jpeg",
    "2026/03/IMG_2689-768x1024.jpeg",
    768,
    1024,
    "La mosquée Omar de Creil — photographie de la galerie officielle",
  ),
  galerie3: photo(
    "galerie-3",
    "2025/12/51d645b5-3bb2-4ccd-a134-78159abcd2e0.jpeg",
    "2025/12/51d645b5-3bb2-4ccd-a134-78159abcd2e0-768x1024.jpeg",
    768,
    1024,
    "Les travaux de la mosquée Omar de Creil, hiver 2025",
  ),
  galerie4: photo(
    "galerie-4",
    "2026/03/IMG_2681.jpeg",
    "2026/03/IMG_2681-1024x768.jpeg",
    1024,
    768,
    "La mosquée Omar de Creil — photographie de la galerie officielle",
  ),
  galerie5: photo(
    "galerie-5",
    "2026/03/IMG_3314.jpeg",
    "2026/03/IMG_3314-768x1024.jpeg",
    768,
    1024,
    "La mosquée Omar de Creil — photographie de la galerie officielle",
  ),
  galerie6: photo(
    "galerie-6",
    "2025/12/IMG_2372.jpeg",
    "2025/12/IMG_2372-1024x768.jpeg",
    1024,
    768,
    "Les travaux de la mosquée Omar de Creil, hiver 2025",
  ),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

/**
 * LOGO OFFICIEL — présent dans la médiathèque WordPress.
 * La variante 300 px est la meilleure version dont l'existence est vérifiée ;
 * le script media:download tente de récupérer l'original non recadré
 * (IMG_8627-modified.png) en priorité.
 */
export const LOGO = {
  remote: `${WP}/wp-content/uploads/2025/03/cropped-cropped-IMG_8627-modified-300x300.png`,
  originalCandidates: [
    `${WP}/wp-content/uploads/2025/03/IMG_8627-modified.png`,
    `${WP}/wp-content/uploads/2025/03/cropped-IMG_8627-modified.png`,
    `${WP}/wp-content/uploads/2025/03/cropped-cropped-IMG_8627-modified.png`,
  ],
  local: "/media/logo.png",
  width: 300,
  height: 300,
  alt: "Logo de la mosquée Omar Ibn al Khattab — Creil",
};

/** URL effective d'une photo selon la stratégie locale/distante. */
export function src(p: Photo): string {
  return USE_LOCAL ? p.local : p.remote;
}

export function logoSrc(): string {
  return USE_LOCAL ? LOGO.local : LOGO.remote;
}

export const GALLERY: Photo[] = [
  PHOTOS.facade,
  PHOTOS.interieur,
  PHOTOS.galerie2,
  PHOTOS.galerie1,
  PHOTOS.galerie5,
  PHOTOS.galerie4,
  PHOTOS.galerie3,
  PHOTOS.galerie6,
  PHOTOS.chantier,
];
