import "server-only";

import { wpFetch } from "./client";
import { mapPage, mapPost } from "./mapper";
import type { Page, Post, WpCategory, WpPage, WpPost } from "./types";

/**
 * Requêtes de haut niveau. Chaque fonction renvoie `null` (ou une liste vide
 * explicite) quand le CMS est injoignable — jamais d'exception non gérée.
 */

export async function getCategoryBySlug(
  slug: string,
): Promise<WpCategory | null> {
  const list = await wpFetch<WpCategory[]>("/categories", { slug });
  return list?.[0] ?? null;
}

export async function getPosts(options?: {
  perPage?: number;
  categorySlug?: string;
}): Promise<Post[] | null> {
  const params: Record<string, string | number> = {
    per_page: options?.perPage ?? 12,
    _embed: "wp:featuredmedia",
    orderby: "date",
    order: "desc",
  };

  if (options?.categorySlug) {
    const category = await getCategoryBySlug(options.categorySlug);
    if (!category) return category === null ? null : [];
    params.categories = category.id;
  }

  const raw = await wpFetch<WpPost[]>("/posts", params);
  return raw ? raw.map(mapPost) : null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const raw = await wpFetch<WpPost[]>("/posts", {
    slug,
    _embed: "wp:featuredmedia",
  });
  return raw?.[0] ? mapPost(raw[0]) : null;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const raw = await wpFetch<WpPage[]>("/pages", { slug });
  return raw?.[0] ? mapPage(raw[0]) : null;
}

/** Slugs récents pour le sitemap (liste vide si CMS injoignable). */
export async function getRecentPostSlugs(): Promise<
  { slug: string; modifiedISO: string }[]
> {
  const raw = await wpFetch<WpPost[]>("/posts", {
    per_page: 50,
    _fields: "slug,modified",
  });
  return (
    raw?.map((p) => ({ slug: p.slug, modifiedISO: p.modified ?? p.date })) ?? []
  );
}
