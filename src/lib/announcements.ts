import "server-only";

import { LOCAL_ANNOUNCEMENTS } from "@/content/announcements";
import { readCollection } from "@/lib/store";
import { getPosts } from "@/lib/wordpress/queries";

/**
 * ============================================================================
 * SYSTÈME D'ANNONCES
 * ----------------------------------------------------------------------------
 * Modèle éditorial daté : une annonce expirée disparaît d'elle-même de la
 * page d'accueil (exigence anti-contenus-obsolètes du cahier des charges).
 *
 * Deux sources fusionnées :
 *  1. Annonces locales curées (src/content/announcements.ts) — contrôle fin
 *     des dates startsAt / endsAt / isPinned ;
 *  2. Articles WordPress de la catégorie « annonces » (à créer côté CMS) —
 *     par prudence, une annonce CMS expire automatiquement
 *     ANNOUNCEMENT_TTL_DAYS jours après sa publication, sauf republication.
 * ============================================================================
 */

export type Announcement = {
  id: string;
  title: string;
  body?: string;
  href?: string;
  hrefLabel?: string;
  /** ISO — date de publication. */
  publishedAt: string;
  /** ISO — l'annonce n'apparaît qu'à partir de cette date. */
  startsAt?: string;
  /** ISO — l'annonce disparaît après cette date. */
  endsAt?: string;
  isPinned?: boolean;
  tone?: "standard" | "important";
};

export const WP_ANNOUNCEMENT_CATEGORY = "annonces";
const ANNOUNCEMENT_TTL_DAYS = 45;

export function isActive(a: Announcement, now: Date = new Date()): boolean {
  const t = now.getTime();
  const published = new Date(a.publishedAt).getTime();
  if (Number.isNaN(published) || published > t) return false;
  if (a.startsAt && new Date(a.startsAt).getTime() > t) return false;
  if (a.endsAt && new Date(a.endsAt).getTime() < t) return false;
  return true;
}

export function sortAnnouncements(list: Announcement[]): Announcement[] {
  return [...list].sort((a, b) => {
    if (Boolean(a.isPinned) !== Boolean(b.isPinned)) return a.isPinned ? -1 : 1;
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
}

/**
 * Toutes les annonces connues (actives ou non), dédupliquées par id.
 * Ordre de priorité : espace bénévoles → WordPress → annonces livrées avec
 * le code.
 */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  const [fromAdmin, fromCms] = await Promise.all([
    getAdminAnnouncements(),
    getCmsAnnouncements(),
  ]);
  const merged = new Map<string, Announcement>();
  for (const a of [...fromAdmin, ...fromCms, ...LOCAL_ANNOUNCEMENTS]) {
    if (!merged.has(a.id)) merged.set(a.id, a);
  }
  return sortAnnouncements([...merged.values()]);
}

/** Annonces actives uniquement — ce que voit la page d'accueil. */
export async function getActiveAnnouncements(
  now: Date = new Date(),
): Promise<Announcement[]> {
  return (await getAllAnnouncements()).filter((a) => isActive(a, now));
}

/**
 * L'admin saisit des jours (2026-02-15) ; une annonce doit rester visible
 * toute la journée de sa date de fin, d'où la normalisation ci-dessous.
 */
const DAY_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const dayStart = (value: string) =>
  DAY_ONLY.test(value) ? `${value}T00:00:00` : value;
const dayEnd = (value: string) =>
  DAY_ONLY.test(value) ? `${value}T23:59:59` : value;

/** Annonces saisies par les bénévoles depuis /admin. */
async function getAdminAnnouncements(): Promise<Announcement[]> {
  const records = await readCollection("annonces");
  return records
    .filter((record) => record.published)
    .map((record) => ({
      id: record.id,
      title: record.title,
      body: record.body || undefined,
      href: record.href || undefined,
      hrefLabel: record.hrefLabel || undefined,
      publishedAt: dayStart(record.publishedAt),
      startsAt: record.startsAt ? dayStart(record.startsAt) : undefined,
      endsAt: record.endsAt ? dayEnd(record.endsAt) : undefined,
      isPinned: record.isPinned,
    }));
}

async function getCmsAnnouncements(): Promise<Announcement[]> {
  const posts = await getPosts({
    perPage: 6,
    categorySlug: WP_ANNOUNCEMENT_CATEGORY,
  });
  if (!posts) return [];
  return posts.map((post) => {
    const published = new Date(post.dateISO);
    const expires = new Date(published);
    expires.setDate(expires.getDate() + ANNOUNCEMENT_TTL_DAYS);
    return {
      id: `wp-${post.id}`,
      title: post.title,
      body: post.excerpt || undefined,
      href: `/actualites/${post.slug}`,
      hrefLabel: "Lire l’annonce",
      publishedAt: post.dateISO,
      endsAt: expires.toISOString(),
    } satisfies Announcement;
  });
}
