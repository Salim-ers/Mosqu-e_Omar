"use client";

import { useState } from "react";

import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Carte à chargement différé : aucun octet Google avant le clic (performance
 * et confidentialité). Le panneau d'attente reste dans la matière du site.
 */
export function MapEmbed({ className }: { className?: string }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2px] border hairline bg-sand",
        className,
      )}
    >
      {active ? (
        <iframe
          src={site.map.embedUrl}
          title={`Plan d’accès — ${site.longName}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full"
        />
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center">
          {/* Le zellige est un calque à part : l'opacité du motif ne doit pas
              atteindre le texte ni le bouton. */}
          <div aria-hidden className="pattern-zellige-soft absolute inset-0" />
          <p className="relative max-w-xs text-[0.9rem] leading-relaxed text-charcoal/65">
            La carte interactive est chargée à la demande, sans requête
            extérieure avant votre accord.
          </p>
          <button
            type="button"
            onClick={() => setActive(true)}
            className="relative inline-flex items-center justify-center rounded-[2px] border border-charcoal bg-charcoal px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-ivory uppercase transition-colors duration-300 hover:bg-ink motion-reduce:transition-none"
          >
            Afficher la carte
          </button>
        </div>
      )}
    </div>
  );
}
