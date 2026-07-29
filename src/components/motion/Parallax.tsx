"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Parallax extrêmement léger sur les grandes images (déplacement ≤ 6 %).
 * L'enfant est légèrement suréchantillonné pour éviter tout bord visible.
 *
 * Écrit sans bibliothèque d'animation : un observateur d'intersection dit si le
 * cadre est à l'écran, et l'écouteur de défilement — passif, borné à une
 * exécution par image — ne travaille que pendant ce temps. Hors écran, plus
 * rien ne tourne.
 */
export function Parallax({
  children,
  className,
  strength = 6,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const interieur = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = cadre.current;
    const inner = interieur.current;
    if (!frame || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let attendu = false;

    const applique = () => {
      attendu = false;
      const r = frame.getBoundingClientRect();
      // 0 quand le cadre entre par le bas de l'écran, 1 quand il en sort par
      // le haut : le déplacement va de -strength à +strength.
      const avancee = 1 - (r.top + r.height) / (window.innerHeight + r.height);
      const borne = Math.min(Math.max(avancee, 0), 1);
      const y = (borne * 2 - 1) * strength;
      inner.style.transform = `translate3d(0, ${y.toFixed(2)}%, 0) scale(1.12)`;
    };

    const auDefilement = () => {
      if (attendu || !visible) return;
      attendu = true;
      requestAnimationFrame(applique);
    };

    const observateur = new IntersectionObserver(
      (entrees) => {
        visible = entrees.some((e) => e.isIntersecting);
        if (visible) applique();
      },
      { rootMargin: "10% 0px" },
    );

    observateur.observe(frame);
    window.addEventListener("scroll", auDefilement, { passive: true });

    return () => {
      observateur.disconnect();
      window.removeEventListener("scroll", auDefilement);
    };
  }, [strength]);

  return (
    <div ref={cadre} className={cn("overflow-hidden", className)}>
      <div
        ref={interieur}
        className="relative h-full w-full scale-[1.12] will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
