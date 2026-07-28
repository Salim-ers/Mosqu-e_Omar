import sanitizeHtml from "sanitize-html";

/**
 * Le HTML provenant de WordPress n'est jamais injecté tel quel : il est
 * strictement filtré (aucun script, aucun style, aucune iframe).
 */
export function sanitizeWpHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "a",
      "figure",
      "figcaption",
      "img",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const isExternal = /^https?:\/\//.test(href);
        return {
          tagName,
          attribs: isExternal
            ? { ...attribs, rel: "noopener noreferrer", target: "_blank" }
            : attribs,
        };
      },
    },
  });
}

/** Retire toutes les balises et normalise les espaces (extraits, titres). */
export function stripHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

/** Décode les entités HTML courantes des titres WordPress. */
export function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;/g, "…")
    .replace(/&nbsp;/g, " ");
}
