"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Parallax extrêmement léger sur les grandes images (déplacement ≤ 6 %).
 * L'enfant est légèrement suréchantillonné pour éviter tout bord visible.
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
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!frame.current || !inner.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          inner.current,
          { yPercent: -strength },
          {
            yPercent: strength,
            ease: "none",
            scrollTrigger: {
              trigger: frame.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={cn("overflow-hidden", className)}>
      <div
        ref={inner}
        className="relative h-full w-full scale-[1.12] will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
