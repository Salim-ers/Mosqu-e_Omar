import type { Metadata } from "next";

import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAlbums, getHeritagePhotos } from "@/lib/content";
import { formatMonthYear } from "@/lib/dates";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "La mosquée Omar Ibn al Khattab de Creil en images : le chantier, la construction, les événements et le lieu aujourd’hui.",
  alternates: { canonical: "/galerie" },
};

export default async function GaleriePage() {
  const [albums, fonds] = await Promise.all([getAlbums(), getHeritagePhotos()]);

  return (
    <>
      <PageHeader
        eyebrow="Galerie"
        title={
          <>
            La mosquée
            <br />
            <em className="font-light italic">en images</em>
          </>
        }
        lead="Du chantier aux premières prières, des cours aux grands rassemblements : les photographies publiées par la mosquée retracent la vie de la communauté."
      />

      {albums.map((album, index) => (
        <section
          key={album.id}
          aria-labelledby={`album-${album.id}`}
          className={`bg-ivory py-16 lg:py-24 ${index > 0 ? "border-t hairline" : ""}`}
        >
          <Container>
            <Reveal>
              <Eyebrow number={String(index + 1).padStart(2, "0")}>
                {album.date ? formatMonthYear(album.date) : "Album"}
              </Eyebrow>
              <h2
                id={`album-${album.id}`}
                className="mt-6 font-display text-4xl leading-tight font-medium text-charcoal sm:text-5xl"
              >
                {album.title}
              </h2>
              {album.description ? (
                <p className="mt-4 max-w-2xl text-[0.98rem] leading-[1.85] text-charcoal/70">
                  {album.description}
                </p>
              ) : null}
            </Reveal>
            <Reveal delay={0.08} className="mt-12">
              <GalleryGrid photos={album.photos} />
            </Reveal>
          </Container>
        </section>
      ))}

      <section
        aria-labelledby="galerie-lieu"
        className={`bg-ivory py-16 lg:py-24 ${albums.length > 0 ? "border-t hairline" : ""}`}
      >
        <Container>
          {albums.length > 0 ? (
            <Reveal>
              <Eyebrow>Le lieu</Eyebrow>
              <h2
                id="galerie-lieu"
                className="mt-6 font-display text-4xl leading-tight font-medium text-charcoal sm:text-5xl"
              >
                La mosquée et son chantier
              </h2>
            </Reveal>
          ) : (
            <h2 id="galerie-lieu" className="sr-only">
              La mosquée et son chantier
            </h2>
          )}
          <Reveal delay={0.08} className={albums.length > 0 ? "mt-12" : ""}>
            <GalleryGrid photos={fonds} />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
