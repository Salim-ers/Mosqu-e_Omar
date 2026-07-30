import type { Metadata } from "next";

import { site, surDomaineDefinitif } from "@/config/site";
import { cormorant, manrope, naskh } from "@/lib/fonts";
import { PHOTOS } from "@/lib/media";

import "./globals.css";

/**
 * Racine du document. Le site public (bandeau, pied de page, données
 * structurées) vit dans le groupe `(site)` ; l'espace bénévoles `/admin`
 * a sa propre mise en page — d'où cette racine volontairement nue.
 */

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Mosquée de Creil (Oise)`,
    template: `%s — ${site.name} · Creil`,
  },
  description:
    "Site officiel de la Mosquée Omar Ibn al Khattab de Creil (Oise), portée par l’association ACCMPR depuis 2013. Horaires de prière (MAWAQIT), cours de Coran et d’arabe, soutien scolaire, dons et vie de la communauté.",
  keywords: [
    "Mosquée Creil",
    "Mosquée Omar Creil",
    "Mosquée Omar Ibn al Khattab Creil",
    "Horaires prière Creil",
    "Mosquée Oise",
    "ACCMPR",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.longName,
    title: `${site.name} — Creil`,
    description:
      "Un lieu de foi, de transmission et de fraternité au cœur de Creil. Horaires de prière, activités, dons et vie de la communauté.",
    images: [{ url: PHOTOS.facade.remote, alt: PHOTOS.facade.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Creil`,
    description:
      "Un lieu de foi, de transmission et de fraternité au cœur de Creil.",
    images: [PHOTOS.facade.remote],
  },
  // Voir `surDomaineDefinitif` : pas d'indexation d'une adresse provisoire.
  robots: surDomaineDefinitif
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${cormorant.variable} ${naskh.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
