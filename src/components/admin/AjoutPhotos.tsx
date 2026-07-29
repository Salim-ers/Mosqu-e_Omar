"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Ajout direct de photos à la photothèque, sans passer par un album. Les
 * images sont réduites dans le navigateur (1800 px de côté, JPEG) avant
 * l'envoi : une photo prise au téléphone part sans manipulation.
 */
const MAX_SIDE = 1800;

async function prepare(file: File): Promise<{
  payload: Blob;
  width: number;
  height: number;
}> {
  if (typeof createImageBitmap !== "function") {
    return { payload: file, width: 0, height: 0 };
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return { payload: file, width: bitmap.width, height: bitmap.height };
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    return blob ? { payload: blob, width, height } : { payload: file, width, height };
  } catch {
    return { payload: file, width: 0, height: 0 };
  }
}

export function AjoutPhotos() {
  const [envoi, setEnvoi] = useState(false);
  const [progression, setProgression] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const router = useRouter();

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setEnvoi(true);
    setErreur(null);

    try {
      const total = files.length;
      let fait = 0;
      for (const file of Array.from(files)) {
        fait += 1;
        setProgression(total > 1 ? `Photo ${fait} sur ${total}…` : "Envoi…");

        const { payload, width, height } = await prepare(file);
        const body = new FormData();
        body.append("file", payload, "photo.jpg");
        body.append("width", String(width));
        body.append("height", String(height));

        const reponse = await fetch("/admin/api/upload", {
          method: "POST",
          body,
        });
        const resultat = (await reponse.json()) as { error?: string };
        if (!reponse.ok) {
          throw new Error(resultat.error ?? "L’envoi de l’image a échoué.");
        }
      }
      // Rafraîchit la liste sans recharger toute la page.
      router.refresh();
    } catch (cause) {
      setErreur(cause instanceof Error ? cause.message : "Envoi impossible.");
    } finally {
      setEnvoi(false);
      setProgression("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-4">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        onChange={(event) => onFiles(event.target.files)}
        className="sr-only"
      />
      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer items-center justify-center rounded-[2px] border border-ink bg-ink px-5 py-2.5 text-[0.7rem] font-semibold tracking-[0.16em] text-ivory uppercase transition-colors hover:border-zellige hover:bg-zellige"
      >
        {envoi ? "Envoi en cours…" : "Ajouter des photos"}
      </label>

      {envoi ? (
        <span className="text-[0.85rem] text-charcoal/60">
          {progression} Ne fermez pas la page.
        </span>
      ) : (
        <span className="text-[0.82rem] text-charcoal/50">
          Plusieurs photos à la fois, depuis l’ordinateur ou le téléphone.
        </span>
      )}

      {erreur ? (
        <p className="w-full text-[0.85rem] text-[#8a2a20]">{erreur}</p>
      ) : null}
    </div>
  );
}
