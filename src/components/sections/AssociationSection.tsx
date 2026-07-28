import { Reveal } from "@/components/motion/Reveal";
import { ArchImage } from "@/components/ui/ArchImage";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { PHOTOS, src } from "@/lib/media";

/**
 * 07 — L'ASSOCIATION ACCMPR. Respiration sombre au milieu de la page :
 * bandeau charbon, trame khatam en filigrane, valeurs en liste typographique.
 */

const VALUES = [
  { label: "Foi", note: "La prière et la spiritualité au centre du lieu" },
  { label: "Transmission", note: "Le savoir religieux offert à chaque génération" },
  { label: "Solidarité", note: "L’entraide concrète au sein de la communauté" },
  { label: "Éducation", note: "Coran, langue arabe et accompagnement scolaire" },
  { label: "Lien social", note: "Un lieu ouvert, ancré dans la ville de Creil" },
  { label: "Vie communautaire", note: "Des moments partagés qui rassemblent" },
];

export function AssociationSection({ number = "07" }: { number?: string }) {
  return (
    <section
      aria-labelledby="association-titre"
      className="on-dark relative overflow-hidden bg-ink py-24 text-ivory lg:py-36"
    >
      <div aria-hidden className="pattern-zellige absolute inset-0" />

      <Container className="relative">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionHeading
                number={number}
                eyebrow="L’association"
                onDark
                title={
                  <span id="association-titre">
                    {site.association.acronym},
                    <br />
                    <em className="font-light italic">
                      depuis {site.association.foundedYear}
                    </em>
                  </span>
                }
                lead={`${site.association.description}, l’association ${site.association.acronym} porte la mosquée Omar Ibn al Khattab : le culte, l’enseignement, la solidarité et la vie de la communauté musulmane de Creil et de sa région.`}
              />
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href="/a-propos" variant="onDark">
                  Découvrir l’association
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.18} className="mt-14 hidden lg:block">
              <ArchImage
                src={src(PHOTOS.galerie3)}
                alt={PHOTOS.galerie3.alt}
                className="aspect-[3/4] w-60"
                sizes="15rem"
              />
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <ul className="border-t border-ivory/12">
              {VALUES.map((value, index) => (
                <li key={value.label} className="border-b border-ivory/12">
                  <Reveal delay={index * 0.05}>
                    <div className="grid gap-2 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                      <span
                        aria-hidden
                        className="hidden font-display text-lg italic text-ivory/30 sm:col-span-2 sm:block"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-3xl font-medium sm:col-span-4">
                        {value.label}
                      </span>
                      <span className="text-[0.9rem] leading-relaxed text-ivory/55 sm:col-span-6">
                        {value.note}
                      </span>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
