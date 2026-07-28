import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PHOTOS, src, type Photo } from "@/lib/media";

/**
 * 06 — GALERIE (aperçu). Composition éditoriale asymétrique de photographies
 * réelles ; la visite complète (avec lightbox) se poursuit sur /galerie.
 */

function Tile({
  photo,
  className,
  sizes,
}: {
  photo: Photo;
  className?: string;
  sizes: string;
}) {
  return (
    <Link
      href="/galerie"
      aria-label="Ouvrir la galerie photo"
      className={`group relative block overflow-hidden bg-sand ${className ?? ""}`}
    >
      <Image
        src={src(photo)}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[1.4s] [transition-timing-function:var(--ease-out-soft)] group-hover:scale-[1.04] motion-reduce:transition-none"
      />
    </Link>
  );
}

export function GalleryPreviewSection({ number = "06" }: { number?: string }) {
  return (
    <section
      aria-labelledby="galerie-titre"
      className="bg-ivory pb-24 lg:pb-36"
    >
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              number={number}
              eyebrow="La mosquée en images"
              title={
                <span id="galerie-titre">
                  Un lieu qui
                  <br />
                  <em className="font-light italic">prend vie</em>
                </span>
              }
            />
            <ButtonLink href="/galerie" variant="outline" className="mb-2">
              Voir la galerie
            </ButtonLink>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12 lg:grid-rows-[18rem_18rem]">
          <Reveal className="col-span-2 lg:col-span-6 lg:row-span-2">
            <Tile
              photo={PHOTOS.facade}
              className="aspect-[4/3] h-full w-full lg:aspect-auto"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-3">
            <Tile
              photo={PHOTOS.galerie4}
              className="aspect-square h-full w-full lg:aspect-auto"
              sizes="(min-width: 1024px) 22vw, 46vw"
            />
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-3 lg:row-span-2">
            <Tile
              photo={PHOTOS.galerie2}
              className="aspect-square h-full w-full lg:aspect-auto"
              sizes="(min-width: 1024px) 22vw, 46vw"
            />
          </Reveal>
          <Reveal delay={0.16} className="lg:col-span-3">
            <Tile
              photo={PHOTOS.galerie6}
              className="aspect-square h-full w-full lg:aspect-auto"
              sizes="(min-width: 1024px) 22vw, 46vw"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
