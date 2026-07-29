"use client";

import { useState } from "react";

import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Plan d'accès. La carte s'affiche directement — c'est l'information la plus
 * attendue d'une page « nous trouver ». Le chargement reste différé
 * (`loading="lazy"`) : rien n'est demandé à Google tant que la carte n'entre
 * pas dans l'écran, et un voile de mosaïque occupe la place en attendant.
 */
export function MapEmbed({ className }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2px] border hairline bg-sand",
        className,
      )}
    >
      {!loaded ? (
        <div aria-hidden className="absolute inset-0">
          <div className="pattern-zellige-soft absolute inset-0" />
        </div>
      ) : null}

      <iframe
        src={site.map.embedUrl}
        title={`Plan d’accès — ${site.longName}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}`}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full transition-opacity duration-700 motion-reduce:transition-none",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
