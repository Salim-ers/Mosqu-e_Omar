import localFont from "next/font/local";

/**
 * Polices auto-hébergées (fichiers OFL vendus dans src/fonts — voir les
 * licences jointes). Aucune requête externe : performance et confidentialité.
 */

/** Sans-serif d'interface — lisibilité maximale. */
export const manrope = localFont({
  src: "../fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-manrope",
});

/** Serif display — grands titres éditoriaux. */
export const cormorant = localFont({
  src: [
    {
      path: "../fonts/cormorant-latin-wght-normal.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../fonts/cormorant-latin-wght-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-cormorant",
});

/** Naskh arabe — réservé aux mentions arabes factuelles (nom de la mosquée). */
export const naskh = localFont({
  src: "../fonts/noto-naskh-arabic-arabic-wght-normal.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-naskh",
  preload: false,
});
