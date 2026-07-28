import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import { cormorant, manrope, naskh } from "@/lib/fonts";
import { PHOTOS } from "@/lib/media";
import { mosqueJsonLd, organizationJsonLd } from "@/lib/seo";

import "./globals.css";

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
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${cormorant.variable} ${naskh.variable}`}
    >
      <body>
        <a
          href="#contenu"
          className="sr-only z-[130] rounded-[2px] bg-charcoal px-5 py-3 text-sm text-ivory focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <JsonLd data={[mosqueJsonLd(), organizationJsonLd()]} />
      </body>
    </html>
  );
}
