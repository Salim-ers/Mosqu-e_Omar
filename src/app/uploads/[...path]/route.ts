import { readFile } from "node:fs/promises";
import path from "node:path";

import { ensureUploadsDir } from "@/lib/store";

/**
 * Sert les photos envoyées depuis l'espace bénévoles. Elles vivent hors du
 * dépôt (dossier de données), d'où cette route plutôt qu'un fichier statique.
 * Le nom demandé est réduit à son `basename` : aucune traversée de dossier
 * (`../`) n'est possible.
 */

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const name = path.basename(segments.at(-1) ?? "");
  const extension = path.extname(name).toLowerCase();
  const type = TYPES[extension];

  if (!name || !type || segments.length !== 1) {
    return new Response("Introuvable", { status: 404 });
  }

  try {
    const file = await readFile(path.join(await ensureUploadsDir(), name));
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": type,
        // Le nom de fichier est unique : le cache peut être immuable.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
