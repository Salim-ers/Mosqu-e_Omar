"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Galerie complète : grille éditoriale (colonnes maçonnées en CSS) + lightbox
 * accessible — Échap pour fermer, flèches pour naviguer, focus capturé,
 * défilement de page verrouillé. Les photos viennent indifféremment du code
 * ou des albums publiés depuis l'espace bénévoles.
 */
export type GalleryPhoto = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () =>
      setIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  );

  return (
    <>
      <ul className="columns-2 gap-4 sm:gap-5 lg:columns-3 [&>li]:mb-4 sm:[&>li]:mb-5">
        {photos.map((photo, i) => (
          <li key={`${photo.url}-${i}`} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden bg-sand"
              aria-label={`Agrandir la photographie ${i + 1} sur ${photos.length}`}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 30vw, 46vw"
                className="h-auto w-full object-cover transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-soft)] group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10 motion-reduce:transition-none"
              />
            </button>
          </li>
        ))}
      </ul>

      {index !== null ? (
        <Lightbox
          photo={photos[index]}
          index={index}
          total={photos.length}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      ) : null}
    </>
  );
}

function Lightbox({
  photo,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  photo: GalleryPhoto;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose, onPrev, onNext]);

  const controlClass =
    "inline-flex h-12 w-12 items-center justify-center rounded-[2px] border border-ivory/30 text-ivory transition-colors duration-300 hover:bg-ivory hover:text-charcoal motion-reduce:transition-none";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photographie ${index + 1} sur ${total}`}
      className="on-dark fixed inset-0 z-[100] flex flex-col bg-ink/97"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-5 py-5 sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[0.7rem] font-semibold tracking-[0.3em] text-ivory/60 uppercase">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className={controlClass}
        >
          <span className="sr-only">Fermer</span>
          <span aria-hidden className="relative block h-5 w-5">
            <span className="absolute top-1/2 left-0 h-px w-5 -translate-y-1/2 rotate-45 bg-current" />
            <span className="absolute top-1/2 left-0 h-px w-5 -translate-y-1/2 -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <div
        className="relative mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-5 pb-4 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-full max-h-[72svh] w-full">
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            sizes="92vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div
        className="flex items-center justify-center gap-4 px-5 pt-2 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onPrev} className={controlClass}>
          <span className="sr-only">Photographie précédente</span>
          <span aria-hidden>←</span>
        </button>
        <button type="button" onClick={onNext} className={controlClass}>
          <span className="sr-only">Photographie suivante</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
