import type { Metadata } from "next";
import Image from "next/image";

import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/config/site";
import { PHOTOS, src } from "@/lib/media";
import { getPageBySlug } from "@/lib/wordpress/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "La nouvelle mosquée",
  description:
    "Le projet de construction de la mosquée Omar Ibn al Khattab de Creil : porté par l’ACCMPR depuis 2013, ouvert aux fidèles depuis le Ramadan 2026.",
  alternates: { canonical: "/projet" },
};

const MILESTONES = [
  {
    period: "2013",
    title: "L’association est fondée",
    note: `L’${site.association.acronym} voit le jour pour porter le culte, l’enseignement et la vie communautaire des musulmans de Creil et de sa région.`,
  },
  {
    period: "Les années de collecte",
    title: "Une communauté se mobilise",
    note: "Fidèles, familles et donateurs financent pas à pas la construction — dons ponctuels, soutiens mensuels et collectes rythment le projet.",
  },
  {
    period: "2025",
    title: "Le chantier prend forme",
    note: "Le gros œuvre s’achève et les espaces intérieurs sont aménagés : salles de prière, espace des sœurs, salles d’ablutions et salles de cours.",
  },
  {
    period: "Ramadan 2026",
    title: "La mosquée ouvre ses portes",
    note: "Al hamdoulillah — les fidèles accomplissent leurs premières prières dans la nouvelle mosquée pour le mois de Ramadan.",
  },
  {
    period: "Aujourd’hui",
    title: "Les extérieurs se poursuivent",
    note: "Façades, parking et espaces verts constituent les dernières étapes. Chaque don contribue à les achever.",
  },
];

export default async function ProjetPage() {
  const wpPage = await getPageBySlug("projet");

  return (
    <>
      {/* Ouverture photographique plein cadre */}
      <section className="on-dark relative flex min-h-[72svh] items-end overflow-hidden bg-ink text-ivory">
        <div className="absolute inset-0">
          <Parallax strength={5} className="h-full w-full">
            <Image
              src={src(PHOTOS.chantier)}
              alt={PHOTOS.chantier.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </Parallax>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/40"
          />
        </div>
        <Container className="relative pt-40 pb-14 lg:pb-20">
          <Reveal>
            <Eyebrow onDark>La nouvelle mosquée</Eyebrow>
            <h1 className="mt-6 max-w-4xl font-display text-[3rem] leading-[1.0] font-medium tracking-[-0.015em] sm:text-6xl lg:text-7xl">
              Un projet de toute
              <br />
              <em className="font-light italic">une communauté</em>
            </h1>
            <p className="mt-7 max-w-2xl text-[1rem] leading-[1.85] text-ivory/85">
              De la fondation de l’association en {site.association.foundedYear}{" "}
              à l’ouverture au Ramadan 2026, la mosquée Omar Ibn al Khattab est
              née de la constance et de la générosité des fidèles de Creil.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Chronologie */}
      <section
        aria-label="Les grandes étapes du projet"
        className="bg-ivory py-20 lg:py-32"
      >
        <Container>
          <ol className="mx-auto max-w-3xl border-l hairline pl-8 sm:pl-12">
            {MILESTONES.map((step, index) => (
              <li key={step.title} className="relative pb-14 last:pb-0">
                <span
                  aria-hidden
                  className="absolute top-1 -left-[2.55rem] h-2 w-2 rotate-45 bg-amber sm:-left-[3.55rem]"
                />
                <Reveal delay={index * 0.04}>
                  <p className="text-[0.68rem] font-semibold tracking-[0.28em] text-taupe uppercase">
                    {step.period}
                  </p>
                  <h2 className="mt-3 font-display text-3xl leading-tight font-medium text-charcoal sm:text-4xl">
                    {step.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-[0.95rem] leading-[1.85] text-charcoal/70">
                    {step.note}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Contenu vivant du CMS, si publié */}
      {wpPage && wpPage.contentHtml.trim().length > 0 ? (
        <section
          aria-label="Informations publiées par la mosquée"
          className="border-t hairline bg-cream py-20 lg:py-28"
        >
          <Container>
            <Reveal>
              <Eyebrow>Le mot de l’association</Eyebrow>
              <div
                className="wp-prose mt-8 max-w-3xl"
                dangerouslySetInnerHTML={{ __html: wpPage.contentHtml }}
              />
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* Diptyque photographique */}
      <section aria-label="Le chantier en images" className="bg-ivory py-20 lg:py-28">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            <Reveal>
              <figure className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src={src(PHOTOS.galerie6)}
                  alt={PHOTOS.galerie6.alt}
                  fill
                  sizes="(min-width: 640px) 46vw, 92vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>
            <Reveal delay={0.08}>
              <figure className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src={src(PHOTOS.galerie1)}
                  alt={PHOTOS.galerie1.alt}
                  fill
                  sizes="(min-width: 640px) 46vw, 92vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Appel final digne */}
      <section
        aria-label="Soutenir l’achèvement du projet"
        className="on-dark relative overflow-hidden bg-ink py-24 text-ivory lg:py-32"
      >
        <div aria-hidden className="pattern-zellige absolute inset-0" />
        <Container className="relative text-center">
          <Reveal>
            <p
              className="font-arabic text-xl text-ivory/70"
              lang="ar"
              dir="rtl"
            >
              {site.arabicName}
            </p>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-[1.05] font-medium sm:text-5xl lg:text-6xl">
              Il reste les façades, le parking
              <br />
              <em className="font-light italic">et les espaces verts</em>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[0.98rem] leading-[1.85] text-ivory/70">
              La mosquée est ouverte, mais le projet n’est pas terminé. Votre
              soutien permet d’achever ce que la communauté a commencé ensemble.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/dons" variant="inverse" className="on-dark">
                Faire un don
              </ButtonLink>
              <ButtonLink href="/galerie" variant="onDark">
                Voir la mosquée en images
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
