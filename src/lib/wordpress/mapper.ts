import { decodeEntities, sanitizeWpHtml, stripHtml } from "@/lib/sanitize";
import type { Page, Post, WpPage, WpPost } from "./types";

export function mapPost(raw: WpPost): Post {
  const media = raw._embedded?.["wp:featuredmedia"]?.[0];
  return {
    id: raw.id,
    slug: raw.slug,
    title: decodeEntities(stripHtml(raw.title?.rendered ?? "")),
    dateISO: raw.date,
    modifiedISO: raw.modified,
    excerpt: decodeEntities(stripHtml(raw.excerpt?.rendered ?? "")).replace(
      /\s*\[…\]\s*$/,
      "…",
    ),
    contentHtml: sanitizeWpHtml(raw.content?.rendered ?? ""),
    cover: media?.source_url
      ? {
          url: media.source_url,
          alt:
            decodeEntities(media.alt_text ?? "") ||
            "Illustration de l’article — Mosquée Omar de Creil",
          width: media.media_details?.width,
          height: media.media_details?.height,
        }
      : null,
  };
}

export function mapPage(raw: WpPage): Page {
  return {
    id: raw.id,
    slug: raw.slug,
    title: decodeEntities(stripHtml(raw.title?.rendered ?? "")),
    modifiedISO: raw.modified,
    contentHtml: sanitizeWpHtml(raw.content?.rendered ?? ""),
  };
}
