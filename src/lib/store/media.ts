import "server-only";

import { randomBytes } from "node:crypto";

import {
  deleteFile,
  deleteRecord,
  newId,
  readCollection,
  saveFile,
  upsertRecord,
} from "@/lib/store";
import type { MediaRecord } from "@/lib/store/types";

/**
 * ============================================================================
 * MÉDIATHÈQUE
 * ----------------------------------------------------------------------------
 * Les photos envoyées depuis l'admin sont confiées au stockage actif (dossier
 * de données ou base) et servies par la route `/uploads/[...]`. Le nom de
 * fichier est régénéré aléatoirement : le nom d'origine, qui peut contenir
 * n'importe quoi, n'atteint jamais le système de fichiers.
 * ============================================================================
 */

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const ACCEPTED_MIME = Object.keys(EXTENSIONS);

export type UploadResult =
  | { ok: true; media: MediaRecord }
  | { ok: false; error: string };

export async function saveUpload(
  file: File,
  options: { alt?: string; width?: number; height?: number; userId: string },
): Promise<UploadResult> {
  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return {
      ok: false,
      error: "Format non accepté — utilisez une image JPEG, PNG, WebP ou AVIF.",
    };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `Image trop lourde (${Math.round(file.size / 1024 / 1024)} Mo) — 8 Mo maximum.`,
    };
  }

  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await saveFile(name, file.type, bytes);

  const media: MediaRecord = {
    id: newId(),
    url: `/uploads/${name}`,
    alt: (options.alt ?? "").trim(),
    width: positiveInt(options.width, 1600),
    height: positiveInt(options.height, 1200),
    bytes: bytes.byteLength,
    createdAt: new Date().toISOString(),
    uploadedBy: options.userId,
  };
  await upsertRecord("medias", media);
  return { ok: true, media };
}

export async function listMedias(): Promise<MediaRecord[]> {
  const list = await readCollection("medias");
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Retire une image de la médiathèque et supprime le fichier associé. */
export async function removeMedia(id: string): Promise<void> {
  const media = (await readCollection("medias")).find((m) => m.id === id);
  if (!media) return;
  await deleteRecord("medias", id);

  // Garde-fou : on ne supprime que ce qui vient bien de la médiathèque.
  const name = media.url.startsWith("/uploads/")
    ? media.url.slice("/uploads/".length)
    : null;
  if (!name || name.includes("/")) return;
  await deleteFile(name);
}

function positiveInt(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) && (value as number) > 0
    ? Math.round(value as number)
    : fallback;
}
