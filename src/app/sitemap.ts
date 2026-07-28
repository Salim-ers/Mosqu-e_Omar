import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { ACTIVITIES } from "@/content/activities";
import { getRecentPostSlugs } from "@/lib/wordpress/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1 },
    { path: "/horaires", priority: 0.9 },
    { path: "/activites", priority: 0.8 },
    { path: "/actualites", priority: 0.7 },
    { path: "/evenements", priority: 0.6 },
    { path: "/projet", priority: 0.8 },
    { path: "/dons", priority: 0.8 },
    { path: "/inscriptions", priority: 0.6 },
    { path: "/a-propos", priority: 0.6 },
    { path: "/galerie", priority: 0.5 },
    { path: "/contact", priority: 0.7 },
    { path: "/mentions-legales", priority: 0.2 },
    { path: "/politique-confidentialite", priority: 0.2 },
  ].map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));

  const activityRoutes: MetadataRoute.Sitemap = ACTIVITIES.map((a) => ({
    url: `${site.url}/activites/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const postSlugs = await getRecentPostSlugs();
  const postRoutes: MetadataRoute.Sitemap = postSlugs.map((p) => ({
    url: `${site.url}/actualites/${p.slug}`,
    lastModified: new Date(p.modifiedISO),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...activityRoutes, ...postRoutes];
}
