import type { Metadata } from "next";

/**
 * Espace bénévoles. Jamais indexé, jamais rendu statiquement : chaque page
 * lit la session en cours et les contenus au moment de la requête.
 */
export const metadata: Metadata = {
  title: {
    default: "Espace bénévoles",
    template: "%s — Espace bénévoles",
  },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
