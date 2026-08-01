import type { NextConfig } from "next";

/**
 * Domaine du WordPress headless (images distantes autorisées).
 * En production, il pourra devenir cms.mosqueeomarcreil.fr : le wildcard
 * *.mosqueeomarcreil.fr couvre ce cas sans changement de code.
 */
const WP_HOST = (() => {
  try {
    return new URL(
      process.env.WORDPRESS_BASE_URL ?? "https://mosqueeomarcreil.fr",
    ).hostname;
  } catch {
    return "mosqueeomarcreil.fr";
  }
})();

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${WP_HOST} https://*.mosqueeomarcreil.fr https://mosqueeomarcreil.fr`,
  "font-src 'self'",
  `connect-src 'self' https://${WP_HOST} https://*.mosqueeomarcreil.fr https://mosqueeomarcreil.fr`,
  "frame-src https://mawaqit.net https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // La CSP n'est appliquée qu'en production (le HMR de dev requiert eval/ws).
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Content-Security-Policy", value: csp }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: WP_HOST },
      { protocol: "https", hostname: "mosqueeomarcreil.fr" },
      { protocol: "https", hostname: "*.mosqueeomarcreil.fr" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  /**
   * Adresses de l'ancien site WordPress, relevées dans son plan du site.
   * Le jour où le domaine basculera, elles ne doivent pas devenir des pages
   * introuvables : un lien partagé dans un groupe WhatsApp, un favori, un
   * résultat de recherche encore en place doivent tous mener quelque part.
   *
   * Permanentes : la nouvelle adresse remplace l'ancienne pour de bon.
   * `/a-propos` et `/projet` existent déjà à l'identique — rien à faire.
   */
  async redirects() {
    return [
      { source: "/donation", destination: "/dons", permanent: true },
      { source: "/abonnement", destination: "/dons/mensuel", permanent: true },
      { source: "/confirmation-de-don", destination: "/dons/merci", permanent: true },
      { source: "/le-don-a-echoue", destination: "/dons", permanent: true },
      { source: "/inscription", destination: "/inscriptions", permanent: true },
    ];
  },
};

export default nextConfig;
