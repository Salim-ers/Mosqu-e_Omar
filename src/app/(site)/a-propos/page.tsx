import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { ArchImage } from "@/components/ui/ArchImage";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";
import { PHOTOS, src } from "@/lib/media";

export const metadata: Metadata = {
  title: "L’association ACCMPR",
  description:
    "L’ACCMPR, institut culturel et cultuel fondé en 2013, porte la mosquée Omar Ibn al Khattab de Creil : culte, enseignement, solidarité et vie communautaire.",
  alternates: { canonical: "/a-propos" },
};

const MISSIONS = [
  {
    label: "Le culte",
    note: "Organiser les cinq prières quotidiennes, la Jumu‘a, les prières de l’Aïd et la Salat Janaza dans les meilleures conditions.",
  },
  {
    label: "L’enseignement",
    note: "Transmettre le Coran, la langue arabe et les sciences religieuses aux enfants comme aux adultes.",
  },
  {
    label: "La solidarité",
    note: "Soutenir les familles, accompagner les jeunes dans leur scolarité et venir en aide aux plus fragiles.",
  },
  {
    label: "Le lien social",
    note: "Faire de la mosquée un lieu ouvert, ancré dans la ville de Creil, au service du vivre-ensemble.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHeader
        eyebrow="L’association"
        title={
          <>
            {site.association.acronym},
            <br />
            <em className="font-light italic">
              depuis {site.association.foundedYear}
            </em>
          </>
        }
        lead={`${site.association.description}, l’association ${site.association.acronym} porte la mosquée Omar Ibn al Khattab et accompagne la communauté musulmane de Creil et de sa région.`}
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="max-w-2xl space-y-5 text-[0.98rem] leading-[1.9] text-charcoal/75">
                  <p>
                    Fondée en {site.association.foundedYear}, l’association a
                    d’abord réuni les fidèles autour d’un lieu de prière
                    provisoire, avant de porter un projet plus grand : offrir à
                    Creil une mosquée digne, ouverte et pérenne.
                  </p>
                  <p>
                    Ce projet, financé par les dons de la communauté, a abouti
                    à l’ouverture de la nouvelle mosquée au Ramadan 2026. Au
                    quotidien, l’association organise le culte, les
                    enseignements, le soutien scolaire et les grands moments de
                    la vie communautaire.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <h2 className="mt-14 font-display text-3xl font-medium text-charcoal sm:text-4xl">
                  Nos missions
                </h2>
                <ul className="mt-7 border-t hairline">
                  {MISSIONS.map((mission, index) => (
                    <li key={mission.label} className="zellige-hover border-b hairline">
                      <div className="grid gap-2 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                        <span
                          aria-hidden
                          className="font-display text-lg italic text-charcoal/30 sm:col-span-1"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-2xl font-medium text-charcoal sm:col-span-4">
                          {mission.label}
                        </h3>
                        <p className="text-[0.9rem] leading-[1.75] text-charcoal/65 sm:col-span-7">
                          {mission.note}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-12 flex flex-wrap gap-4">
                  <ButtonLink href="/projet">
                    L’histoire de la mosquée
                  </ButtonLink>
                  <ButtonLink href="/contact" variant="outline">
                    Contacter l’association
                  </ButtonLink>
                </div>
              </Reveal>
            </div>

            <aside className="lg:col-span-5">
              <Reveal delay={0.06}>
                <ArchImage
                  src={src(PHOTOS.galerie2)}
                  alt={PHOTOS.galerie2.alt}
                  className="mx-auto aspect-[3/4] w-full max-w-md"
                  sizes="(min-width: 1024px) 36vw, 88vw"
                />
              </Reveal>
              <Reveal delay={0.14}>
                <dl className="mt-10 space-y-5 border-t hairline pt-8 text-[0.9rem]">
                  <div className="flex justify-between gap-6">
                    <dt className="text-taupe">Nom</dt>
                    <dd className="text-right font-medium text-charcoal">
                      {site.association.acronym}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-taupe">Nature</dt>
                    <dd className="text-right font-medium text-charcoal">
                      {site.association.description}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-taupe">Fondation</dt>
                    <dd className="text-right font-medium text-charcoal">
                      {site.association.foundedYear}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-taupe">SIRET</dt>
                    <dd className="text-right font-medium text-charcoal">
                      {site.association.siret}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
