"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { LOGO, logoSrc } from "@/lib/media";

/**
 * Écran d'accueil affiché le temps que la page se charge : mosaïque en fond,
 * sceau de la mosquée au centre.
 *
 * Il est présent dès le HTML initial pour couvrir l'écran sans battement, puis
 * s'effface de lui-même au chargement complet de la page. Trois garde-fous,
 * pour qu'un voile ne puisse jamais retenir un visiteur :
 *
 *  – une durée minimale de 700 ms, sinon il n'apparaîtrait que par éclairs ;
 *  – une durée maximale de 2,5 s, même si une image tarde ;
 *  – il ne s'affiche qu'aux chargements complets, pas lors de la navigation
 *    d'une page à l'autre — la mise en page n'étant pas remontée entre-temps.
 *
 * Sans JavaScript, une règle `noscript` de la mise en page le masque. Le
 * contenu de la page est dans le HTML sous le voile : rien n'échappe aux
 * moteurs de recherche.
 */
const DUREE_MINIMALE_MS = 700;
const DUREE_MAXIMALE_MS = 2500;

export function EcranChargement() {
  const [etat, setEtat] = useState<"visible" | "sortie" | "retire">("visible");

  useEffect(() => {
    const depart = Date.now();
    let sortie: ReturnType<typeof setTimeout>;
    let retrait: ReturnType<typeof setTimeout>;

    const termine = () => {
      const reste = Math.max(0, DUREE_MINIMALE_MS - (Date.now() - depart));
      sortie = setTimeout(() => {
        setEtat("sortie");
        // Retiré du DOM une fois la disparition jouée.
        retrait = setTimeout(() => setEtat("retire"), 650);
      }, reste);
    };

    const secours = setTimeout(termine, DUREE_MAXIMALE_MS);

    if (document.readyState === "complete") {
      termine();
    } else {
      window.addEventListener("load", termine, { once: true });
    }

    return () => {
      clearTimeout(secours);
      clearTimeout(sortie);
      clearTimeout(retrait);
      window.removeEventListener("load", termine);
    };
  }, []);

  if (etat === "retire") return null;

  return (
    <div
      aria-hidden
      data-splash={etat}
      className="splash on-dark fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-ink"
    >
      <div aria-hidden className="pattern-zellige absolute inset-0" />

      <div className="relative flex flex-col items-center">
        <Image
          src={logoSrc()}
          alt=""
          width={LOGO.width}
          height={LOGO.height}
          priority
          className="splash-logo h-24 w-24 rounded-full object-cover ring-1 ring-ivory/20 sm:h-28 sm:w-28"
        />
        <p className="mt-7 font-display text-xl font-medium tracking-wide text-ivory/90">
          Mosquée Omar Ibn al Khattab
        </p>
        <p className="mt-2 text-[0.6rem] font-semibold tracking-[0.32em] text-ivory/50 uppercase">
          Creil — Oise
        </p>
        <span aria-hidden className="splash-jauge mt-8 block h-px w-32 bg-ivory/15">
          <span className="splash-jauge-trait block h-full bg-gold" />
        </span>
      </div>
    </div>
  );
}
