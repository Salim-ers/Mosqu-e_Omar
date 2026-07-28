import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAlbums, HERITAGE_PHOTOS, type PublicImage } from "@/lib/content";

/**
 * 06 — GALERIE (aperçu). Composition éditoriale asymétrique en quatre
 * photographies : les plus récentes publiées par les bénévoles passent devant,
 * complétées au besoin par les photographies d'origine du site. La visite
 * complète (avec lightbox) se poursuit sur /galerie.
 */

function Tile({
  photo,
  className,
  sizes,
}: {
  photo: PublicImage;
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
        src={photo.url}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[1.4s] [transition-timing-function:var(--ease-out-soft)] group-hover:scale-[1.04] motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-zellige/0 transition-colors duration-500 group-hover:bg-zellige/25 motion-reduce:transition-none"
      />
    </Link>
  );
}

export async function GalleryPreviewSection({
  number = "06",
}: {
  number?: string;
}) {
  const albums = await getAlbums();
  const recentes = albums.flatMap((album) => album.photos);
  // Quatre visuels : d'abord les albums, puis le fonds d'origine en appoint.
  const [a, b, c, d] = [...recentes, ...HERITAGE_PHOTOS].slice(0, 4);

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
              photo={a}
              className="aspect-[4/3] h-full w-full lg:aspect-auto"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-3">
            <Tile
              photo={b}
              className="aspect-square h-full w-full lg:aspect-auto"
              sizes="(min-width: 1024px) 22vw, 46vw"
            />
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-3 lg:row-span-2">
            <Tile
              photo={c}
              className="aspect-square h-full w-full lg:aspect-auto"
              sizes="(min-width: 1024px) 22vw, 46vw"
            />
          </Reveal>
          <Reveal delay={0.16} className="lg:col-span-3">
            <Tile
              photo={d}
              className="aspect-square h-full w-full lg:aspect-auto"
              sizes="(min-width: 1024px) 22vw, 46vw"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
