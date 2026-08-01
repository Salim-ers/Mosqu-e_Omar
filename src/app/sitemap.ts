import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { getActivities, getSiteArticles } from "@/lib/content";
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
    { path: "/dons/mensuel", priority: 0.6 },
    { path: "/inscriptions", priority: 0.6 },
    { path: "/janaza", priority: 0.4 },
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

  const activities = await getActivities();
  const activityRoutes: MetadataRoute.Sitemap = activities.map((activity) => ({
    url: `${site.url}/activites/${activity.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Articles publiés depuis l'espace bénévoles + articles WordPress restants.
  const articles = await getSiteArticles();
  const ownSlugs = new Set(articles.map((article) => article.slug));
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${site.url}/actualites/${article.slug}`,
    lastModified: new Date(article.dateISO),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const postSlugs = await getRecentPostSlugs();
  const postRoutes: MetadataRoute.Sitemap = postSlugs
    .filter((post) => !ownSlugs.has(post.slug))
    .map((post) => ({
      url: `${site.url}/actualites/${post.slug}`,
      lastModified: new Date(post.modifiedISO),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [
    ...staticRoutes,
    ...activityRoutes,
    ...articleRoutes,
    ...postRoutes,
  ];
}
