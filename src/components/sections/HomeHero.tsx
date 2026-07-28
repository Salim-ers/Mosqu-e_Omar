"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { PHOTOS, src } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * HERO — presque 100vh, photographie réelle de la mosquée, révélation très
 * lente : l'image se dévoile, puis les lignes du titre montent l'une après
 * l'autre, puis la signature et les actions. Parallax ≤ 6 % au scroll.
 */
export function HomeHero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.15,
        });

        tl.fromTo(
          "[data-hero-image]",
          { autoAlpha: 0, scale: 1.07 },
          { autoAlpha: 1, scale: 1, duration: 2.2, ease: "power2.out" },
        )
          .fromTo(
            "[data-hero-line]",
            { yPercent: 112 },
            { yPercent: 0, duration: 1.35, stagger: 0.14 },
            "-=1.7",
          )
          .fromTo(
            "[data-hero-fade]",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12 },
            "-=0.8",
          );

        gsap.to("[data-hero-parallax]", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="on-dark relative flex min-h-[92svh] flex-col justify-end overflow-hidden bg-ink text-ivory"
      aria-label="La mosquée Omar Ibn al Khattab de Creil"
    >
      {/* Photographie réelle de la mosquée */}
      <div data-hero-image className="absolute inset-0 will-change-transform">
        <div data-hero-parallax className="absolute inset-[-8%]">
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
          data-hero-fade
          className="font-arabic text-lg text-ivory/75 sm:text-xl"
          lang="ar"
          dir="rtl"
        >
          {site.arabicName}
        </p>

        <h1 className="mt-5 font-display text-[14vw] leading-[0.92] font-medium tracking-[-0.015em] sm:text-[11vw] lg:text-[8.2rem] xl:text-[9.5rem]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block will-change-transform">
              Mosquée Omar
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block will-change-transform">
              Ibn al Khattab
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p
            data-hero-fade
            className="max-w-md text-[1rem] leading-[1.8] text-ivory/85 sm:text-[1.05rem]"
          >
            Un lieu de foi, de transmission et de fraternité,
            <br className="hidden sm:block" /> au cœur de Creil.
          </p>

          <div data-hero-fade className="flex flex-wrap items-center gap-4">
            <ButtonLink href="/projet" variant="onImage">
              Découvrir la mosquée
            </ButtonLink>
            <ButtonLink href="/horaires" variant="inverse">
              Horaires de prière
            </ButtonLink>
          </div>
        </div>

        <div
          data-hero-fade
          className="mt-12 flex items-center gap-5 border-t border-ivory/15 pt-6"
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
