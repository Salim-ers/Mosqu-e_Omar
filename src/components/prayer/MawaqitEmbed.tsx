"use client";

import { useState } from "react";

import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Intégration officielle MAWAQIT — l'unique source des horaires de prière.
 * Aucun horaire n'est calculé ni réécrit par le site : on encadre simplement
 * le widget déjà utilisé par la mosquée (vue /m/), dans un écrin premium.
 */
export function MawaqitEmbed({
  className,
  tall = false,
}: {
  className?: string;
  tall?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2px] border hairline bg-cream shadow-[var(--shadow-soft)]",
        tall ? "h-[640px] sm:h-[700px]" : "h-[560px] sm:h-[620px]",
        className,
      )}
    >
      {!loaded ? (
        <div aria-hidden className="absolute inset-0 p-5">
          <div className="skeleton h-full w-full rounded-[2px]" />
        </div>
      ) : null}
      <iframe
        src={site.mawaqit.embedUrl}
        title={`Horaires de prière officiels — ${site.longName} (MAWAQIT)`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full transition-opacity duration-700 motion-reduce:transition-none",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
