"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { BUTTON_STYLES } from "@/components/admin/inputStyles";
import { remplacerPhotoSite } from "@/app/admin/actions";

/**
 * Remplacer une photographie livrée avec le site par une photo de
 * l'association. La photo est réduite dans le navigateur, envoyée, puis
 * l'adresse obtenue est transmise à l'action serveur — le tout en un seul
 * geste pour le bénévole.
 */
const MAX_SIDE = 2400;

async function prepare(file: File) {
  if (typeof createImageBitmap !== "function") {
    return { payload: file as Blob, width: 0, height: 0 };
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
      return { payload: file as Blob, width: bitmap.width, height: bitmap.height };
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.88),
    );
    return blob
      ? { payload: blob, width, height }
      : { payload: file as Blob, width, height };
  } catch {
    return { payload: file as Blob, width: 0, height: 0 };
  }
}

export function RemplacerPhotoLivree({
  cle,
  libelle = "Remplacer",
}: {
  cle: string;
  libelle?: string;
}) {
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function onFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setEnvoi(true);
    setErreur(null);
    try {
      const { payload, width, height } = await prepare(file);
      const body = new FormData();
      body.append("file", payload, "photo.jpg");
      body.append("width", String(width));
      body.append("height", String(height));

      const reponse = await fetch("/admin/api/upload", { method: "POST", body });
      const resultat = (await reponse.json()) as {
        url?: string;
        width?: number;
        height?: number;
        error?: string;
      };
      if (!reponse.ok || !resultat.url) {
        throw new Error(resultat.error ?? "L’envoi de l’image a échoué.");
      }

      const donnees = new FormData();
      donnees.append("image", JSON.stringify({ ...resultat, alt: "" }));
      await remplacerPhotoSite(cle, donnees);
      router.refresh();
    } catch (cause) {
      setErreur(cause instanceof Error ? cause.message : "Remplacement impossible.");
    } finally {
      setEnvoi(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(event) => onFile(event.target.files)}
        className="sr-only"
      />
      <label htmlFor={inputId} className={`${BUTTON_STYLES.ghost} cursor-pointer`}>
        {envoi ? "Envoi…" : libelle}
      </label>
      {erreur ? (
        <span className="text-[0.8rem] text-[#8a2a20]">{erreur}</span>
      ) : null}
    </>
  );
}
