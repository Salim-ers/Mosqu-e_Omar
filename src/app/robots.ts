import type { MetadataRoute } from "next";

import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // L'espace bénévoles n'a rien à faire dans un index : il est derrière un
    // mot de passe, et une page de connexion explorée n'apporte rien.
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/don-formulaire", "/don-passerelle"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
