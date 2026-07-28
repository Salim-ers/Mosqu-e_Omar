/**
 * ============================================================================
 * ÉCRITURE SIMPLE → HTML
 * ----------------------------------------------------------------------------
 * Les bénévoles rédigent en texte courant, avec une poignée de conventions
 * (titres `##`, listes `-`, **gras**, *italique*, [lien](url)). Le texte est
 * d'abord entièrement échappé : le HTML produit ne peut contenir que les
 * balises générées ici — aucune injection possible depuis l'admin.
 * ============================================================================
 */

const AIDE = [
  "## Titre de section",
  "### Sous-titre",
  "- élément de liste",
  "> citation",
  "**gras** · *italique* · [texte du lien](https://…)",
];

export const RICHTEXT_HELP = AIDE.join("  ·  ");

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** URL acceptée dans un lien : http(s), mailto, tel, ou chemin interne. */
function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (/^https?:\/\//i.test(href)) return href;
  if (/^(mailto:|tel:)/i.test(href)) return href;
  if (href.startsWith("/")) return href;
  return null;
}

function inline(text: string): string {
  let html = escapeHtml(text);

  html = html.replace(
    /\[([^\]\n]+)\]\(([^)\s]+)\)/g,
    (match, label: string, url: string) => {
      const href = safeHref(url);
      if (!href) return label;
      const external = /^https?:\/\//i.test(href);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${href}"${attrs}>${label}</a>`;
    },
  );

  html = html.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return html;
}

/** Convertit le texte saisi dans l'admin en HTML sûr. */
export function richTextToHtml(source: string): string {
  const blocks = source.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  const out: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").filter((line) => line.trim().length > 0);
    if (lines.length === 0) continue;

    if (lines.every((line) => /^\s*[-•]\s+/.test(line))) {
      const items = lines
        .map((line) => `<li>${inline(line.replace(/^\s*[-•]\s+/, ""))}</li>`)
        .join("");
      out.push(`<ul>${items}</ul>`);
      continue;
    }

    if (lines.every((line) => /^\s*>\s?/.test(line))) {
      const quote = lines.map((line) => line.replace(/^\s*>\s?/, "")).join(" ");
      out.push(`<blockquote>${inline(quote)}</blockquote>`);
      continue;
    }

    const heading = lines[0].match(/^(#{2,3})\s+(.*)$/);
    if (heading && lines.length === 1) {
      const level = heading[1].length === 2 ? "h2" : "h3";
      out.push(`<${level}>${inline(heading[2])}</${level}>`);
      continue;
    }

    out.push(`<p>${lines.map(inline).join("<br />")}</p>`);
  }

  return out.join("\n");
}

/** Extrait un résumé court d'un texte en écriture simple. */
export function richTextExcerpt(source: string, max = 180): string {
  const plain = source
    .replace(/\r\n/g, "\n")
    .replace(/^#{2,3}\s+/gm, "")
    .replace(/^\s*[-•>]\s+/gm, "")
    .replace(/\[([^\]\n]+)\]\([^)\s]+\)/g, "$1")
    .replace(/\*\*?/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
