import "server-only";

/**
 * Client WordPress REST minimal et résilient.
 *  – ISR : chaque requête est mise en cache et revalidée (défaut : 1 h) ;
 *  – Timeout strict (8 s) : le front ne dépend jamais de la disponibilité
 *    du CMS — en cas d'échec, `null` est renvoyé et les pages basculent sur
 *    leur contenu de secours (voir src/content/*) ;
 *  – Aucune requête WordPress côté client : tout passe par le serveur.
 */

const TIMEOUT_MS = 8_000;
export const REVALIDATE_SECONDS = 3_600;

export function wpApiBase(): string {
  if (process.env.WORDPRESS_API_URL) return process.env.WORDPRESS_API_URL;
  const base = process.env.WORDPRESS_BASE_URL ?? "https://mosqueeomarcreil.fr";
  return `${base.replace(/\/$/, "")}/wp-json/wp/v2`;
}

export async function wpFetch<T>(
  path: string,
  params: Record<string, string | number> = {},
  revalidate: number = REVALIDATE_SECONDS,
): Promise<T | null> {
  try {
    const url = new URL(wpApiBase() + path);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
    const res = await fetch(url.toString(), {
      next: { revalidate },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // CMS injoignable : on laisse la couche supérieure servir le fallback.
    return null;
  }
}
