import Image from "next/image";

import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { PHOTOS, src } from "@/lib/media";

/**
 * 04 — LA NOUVELLE MOSQUÉE. L'aboutissement du projet : ouverture au
 * Ramadan 2026 (fait sourcé du site actuel). Les travaux extérieurs restants
 * sont mentionnés comme en cours — le détail vit sur la page Projet,
 * alimentée dynamiquement par le CMS.
 */
export function NewMosqueSection({ number = "04" }: { number?: string }) {
  return (
    <section
      aria-labelledby="nouvelle-mosquee-titre"
      className="overflow-hidden bg-ivory py-24 lg:py-36"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <Reveal>
              <Parallax
                strength={4}
                className="relative aspect-[4/3] w-full bg-sand shadow-[var(--shadow-lift)]"
              >
                <Image
                  src={src(PHOTOS.galerie1)}
                  alt={PHOTOS.galerie1.alt}
                  fill
                  sizes="(min-width: 1024px) 48vw, 92vw"
                  className="object-cover"
                />
              </Parallax>
            </Reveal>
            <Reveal delay={0.12}>
              <figure className="relative -mt-16 ml-auto hidden w-2/5 border-[6px] border-ivory bg-sand shadow-[var(--shadow-soft)] sm:block">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={src(PHOTOS.galerie3)}
                    alt={PHOTOS.galerie3.alt}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            </Reveal>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <Reveal>
              <SectionHeading
                number={number}
                eyebrow="La nouvelle mosquée"
                title={
                  <span id="nouvelle-mosquee-titre">
                    Un projet porté par
                    <br />
                    <em className="font-light italic">toute une communauté</em>
                  </span>
                }
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-xl space-y-5 text-[0.98rem] leading-[1.85] text-charcoal/75">
                <p>
                  Al hamdoulillah — après des années de collecte portées par les
                  fidèles et les donateurs, la construction de la nouvelle
                  mosquée Omar s’est achevée pour vous accueillir à partir du{" "}
                  <strong className="font-semibold text-charcoal">
                    Ramadan 2026
                  </strong>
                  .
                </p>
                <p>
                  Les aménagements extérieurs — façades, parking et espaces
                  verts — se poursuivent. Chaque contribution continue de faire
                  avancer ce lieu que la communauté de Creil attendait depuis{" "}
                  {site.association.foundedYear}.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/projet">Découvrir le projet</ButtonLink>
                <ButtonLink href="/dons" variant="outline">
                  Soutenir la mosquée
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
