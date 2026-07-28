import { getCurrentUser } from "@/lib/auth";
import { saveUpload } from "@/lib/store/media";

/**
 * Réception des photos envoyées depuis l'espace bénévoles. Réservée aux
 * comptes connectés ; le type et le poids du fichier sont vérifiés côté
 * serveur, indépendamment de ce que le navigateur a envoyé.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Session expirée." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const number = (name: string) => {
    const value = Number.parseInt(String(form.get(name) ?? ""), 10);
    return Number.isFinite(value) && value > 0 ? value : undefined;
  };

  const result = await saveUpload(file, {
    alt: String(form.get("alt") ?? ""),
    width: number("width"),
    height: number("height"),
    userId: user.id,
  });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json({
    url: result.media.url,
    width: result.media.width,
    height: result.media.height,
  });
}
