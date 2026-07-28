import { readFile } from "@/lib/store";

/**
 * Sert les photos envoyées depuis l'espace bénévoles. Elles vivent hors du
 * dépôt (dossier de données ou base), d'où cette route plutôt qu'un fichier
 * statique. Un seul segment est accepté et il ne peut contenir de séparateur :
 * aucune traversée de dossier n'est possible.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const name = segments.at(0) ?? "";

  if (segments.length !== 1 || !/^[a-z0-9-]+\.[a-z0-9]+$/i.test(name)) {
    return new Response("Introuvable", { status: 404 });
  }

  const file = await readFile(name);
  if (!file) return new Response("Introuvable", { status: 404 });

  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.mime,
      // Le nom de fichier est unique : le cache peut être immuable.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
