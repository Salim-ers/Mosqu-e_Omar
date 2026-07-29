"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { PHOTOS, src } from "@/lib/media";

/**
 * HERO — plein écran, photographie réelle de la mosquée, révélation très
 * lente : l'image se dévoile, puis les lignes du titre montent l'une après
 * l'autre, puis la signature et les actions.
 *
 * Toute l'entrée en scène est faite d'animations CSS déclarées dans
 * globals.css : elles sont jouées par le compositeur, sans une ligne de
 * JavaScript. Seul le léger parallax garde un écouteur — un seul, passif, et
 * la position n'est appliquée qu'une fois par image d'écran.
 *
 * `min-h-svh` et non 92 % : à hauteur partielle, la section ivoire suivante
 * apparaissait en bas de l'écran comme une bande blanche sous la photographie.
 */
export function HomeHero() {
  const parallax = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = parallax.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let attendu = false;

    const applique = () => {
      attendu = false;
      // 8 % de la hauteur de l'écran au plus : le débordement de la
      // photographie (inset -8%) couvre exactement ce déplacement.
      const avancee = Math.min(window.scrollY / window.innerHeight, 1);
      el.style.transform = `translate3d(0, ${(avancee * 8).toFixed(2)}%, 0)`;
    };

    const auDefilement = () => {
      if (attendu) return;
      attendu = true;
      requestAnimationFrame(applique);
    };

    applique();
    window.addEventListener("scroll", auDefilement, { passive: true });
    return () => window.removeEventListener("scroll", auDefilement);
  }, []);

  return (
    <section
      className="on-dark relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink text-ivory"
      aria-label="La mosquée Omar Ibn al Khattab de Creil"
    >
      {/* Photographie réelle de la mosquée */}
      <div className="hero-image absolute inset-0">
        <div ref={parallax} className="absolute inset-[-8%] will-change-transform">
          <Image
            src={src(PHOTOS.facade)}
            alt={PHOTOS.facade.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Voile très léger — lisibilité sans écraser la photographie */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/35"
        />
      </div>

      <div className="relative mx-auto w-full max-w-[100rem] px-5 pt-40 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <p
          className="hero-fade font-arabic text-lg text-ivory/75 sm:text-xl"
          style={{ animationDelay: "1.15s" }}
          lang="ar"
          dir="rtl"
        >
          {site.arabicName}
        </p>

        <h1 className="mt-5 font-display text-[14vw] leading-[0.92] font-medium tracking-[-0.015em] sm:text-[11vw] lg:text-[8.2rem] xl:text-[9.5rem]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line block" style={{ animationDelay: "0.5s" }}>
              Mosquée Omar
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line block" style={{ animationDelay: "0.64s" }}>
              Ibn al Khattab
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p
            className="hero-fade max-w-md text-[1rem] leading-[1.8] text-ivory/85 sm:text-[1.05rem]"
            style={{ animationDelay: "1.27s" }}
          >
            Un lieu de foi, de transmission et de fraternité,
            <br className="hidden sm:block" /> au cœur de Creil.
          </p>

          <div
            className="hero-fade flex flex-wrap items-center gap-4"
            style={{ animationDelay: "1.39s" }}
          >
            <ButtonLink href="/projet" variant="onImage">
              Découvrir la mosquée
            </ButtonLink>
            <ButtonLink href="/horaires" variant="inverse">
              Horaires de prière
            </ButtonLink>
          </div>
        </div>

        <div
          className="hero-fade mt-12 flex items-center gap-5 border-t border-ivory/15 pt-6"
          style={{ animationDelay: "1.51s" }}
        >
          <p className="text-[0.64rem] font-semibold tracking-[0.34em] text-ivory/60 uppercase">
            Creil — Oise
          </p>
          <span aria-hidden className="h-3 w-px bg-ivory/25" />
          <p className="text-[0.64rem] font-semibold tracking-[0.34em] text-ivory/60 uppercase">
            {site.association.acronym}
          </p>
          <span aria-hidden className="h-3 w-px bg-ivory/25" />
          <p className="text-[0.64rem] font-semibold tracking-[0.34em] text-ivory/60 uppercase">
            Depuis {site.association.foundedYear}
          </p>
        </div>
      </div>
    </section>
  );
}
