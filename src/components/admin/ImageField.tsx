"use client";

import { useId, useRef, useState } from "react";

import { INPUT_CLASS } from "@/components/admin/inputStyles";

/**
 * Envoi de photos depuis l'admin. Les images sont réduites dans le navigateur
 * (1800 px de côté maximum, JPEG) avant l'envoi : un bénévole peut choisir une
 * photo prise au téléphone sans se soucier de son poids.
 */

export type StoredImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

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
    if (!context) return { payload: file, width: bitmap.width, height: bitmap.height };
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) return { payload: file, width, height };
    return { payload: blob, width, height };
  } catch {
    return { payload: file, width: 0, height: 0 };
  }
}

async function upload(file: File): Promise<StoredImage> {
  const { payload, width, height } = await prepare(file);
  const body = new FormData();
  body.append("file", payload, "photo.jpg");
  body.append("width", String(width));
  body.append("height", String(height));

  const response = await fetch("/admin/api/upload", { method: "POST", body });
  const result = (await response.json()) as {
    url?: string;
    width?: number;
    height?: number;
    error?: string;
  };
  if (!response.ok || !result.url) {
    throw new Error(result.error ?? "L’envoi de l’image a échoué.");
  }
  return {
    url: result.url,
    alt: "",
    width: result.width,
    height: result.height,
  };
}

export function ImageField({
  name,
  initial,
  multiple = false,
}: {
  name: string;
  initial: StoredImage[];
  multiple?: boolean;
}) {
  const [images, setImages] = useState<StoredImage[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const serialized = multiple
    ? JSON.stringify(images)
    : JSON.stringify(images[0] ?? null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded: StoredImage[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await upload(file));
      }
      setImages((current) =>
        multiple ? [...current, ...uploaded] : uploaded.slice(0, 1),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Envoi impossible.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function updateAlt(index: number, alt: string) {
    setImages((current) =>
      current.map((image, i) => (i === index ? { ...image, alt } : image)),
    );
  }

  function move(index: number, direction: -1 | 1) {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setImages((current) => current.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialized} />

      {images.length > 0 ? (
        <ul className="space-y-3">
          {images.map((image, index) => (
            <li
              key={`${image.url}-${index}`}
              className="flex flex-wrap items-start gap-4 rounded-[2px] border border-charcoal/12 bg-ivory p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt=""
                className="h-20 w-28 shrink-0 rounded-[2px] object-cover"
              />
              <div className="min-w-[14rem] flex-1 space-y-2">
                <label className="block text-[0.62rem] font-semibold tracking-[0.18em] text-charcoal/50 uppercase">
                  Description de l’image
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(event) => updateAlt(index, event.target.value)}
                    placeholder="Ce que montre la photo — pour les personnes non voyantes"
                    className={`${INPUT_CLASS} mt-1.5 normal-case`}
                  />
                </label>
              </div>
              <div className="flex items-center gap-1">
                {multiple ? (
                  <>
                    <IconButton
                      label="Monter"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                    >
                      ↑
                    </IconButton>
                    <IconButton
                      label="Descendre"
                      onClick={() => move(index, 1)}
                      disabled={index === images.length - 1}
                    >
                      ↓
                    </IconButton>
                  </>
                ) : null}
                <IconButton label="Retirer" onClick={() => remove(index)}>
                  ✕
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={multiple}
          onChange={(event) => onFiles(event.target.files)}
          className="sr-only"
        />
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center gap-2 rounded-[2px] border border-charcoal/25 px-5 py-2.5 text-[0.7rem] font-semibold tracking-[0.16em] text-charcoal uppercase transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
        >
          {busy
            ? "Envoi en cours…"
            : images.length > 0 && !multiple
              ? "Remplacer la photo"
              : multiple
                ? "Ajouter des photos"
                : "Choisir une photo"}
        </label>
        {busy ? (
          <span className="text-[0.8rem] text-charcoal/50">
            Merci de patienter, ne fermez pas la page.
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="text-[0.84rem] text-[#8a2a20]">{error}</p>
      ) : null}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled = false,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-charcoal/15 text-charcoal/60 transition-colors hover:border-charcoal hover:text-charcoal disabled:opacity-30"
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden>{children}</span>
    </button>
  );
}
