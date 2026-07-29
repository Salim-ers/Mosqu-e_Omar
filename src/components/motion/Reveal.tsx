"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Révélation douce à l'entrée dans l'écran.
 *
 * Écrit avec un observateur d'intersection et une transition CSS, sans
 * bibliothèque d'animation : le composant est utilisé près de cent fois dans
 * le site, et chaque instance coûtait auparavant un déclencheur de défilement
 * recalculé à chaque image — soixante rien que sur la page d'accueil. Ici, le
 * navigateur détecte l'entrée en écran de son côté, et la transition est
 * composée par le processeur graphique.
 *
 * L'observateur se débranche dès que l'élément est apparu : plus rien ne
 * tourne ensuite. `prefers-reduced-motion` affiche tout immédiatement, et une
 * règle `noscript` garantit le contenu visible sans JavaScript.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // `prefers-reduced-motion` est traité en CSS : la transition est alors
    // supprimée et l'élément apparaît d'un coup à son entrée en écran. Le faire
    // ici demanderait de changer l'état pendant l'effet, ce qui déclenche un
    // second rendu en cascade.
    const observateur = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) {
          setVisible(true);
          observateur.disconnect();
        }
      },
      // Se déclenche un peu avant que l'élément soit entièrement visible.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );

    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={visible ? "vu" : "attente"}
      className={cn("reveal", className)}
      style={
        visible
          ? { transitionDelay: `${delay}s` }
          : {
              transitionDelay: `${delay}s`,
              opacity: 0,
              transform: `translateY(${y}px)`,
            }
      }
    >
      {children}
    </div>
  );
}
