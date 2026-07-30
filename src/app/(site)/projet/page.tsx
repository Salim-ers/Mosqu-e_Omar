import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/config/site";
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
      {/* Ouverture sur la mosaïque, contenu centré */}
      <section className="on-dark relative flex min-h-[66svh] items-center justify-center overflow-hidden bg-ink py-32 text-ivory lg:py-40">
        <div aria-hidden className="pattern-zellige absolute inset-0" />
        <Container className="relative">
          <Reveal>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <p
                className="font-arabic text-xl text-ivory/85 sm:text-2xl"
                lang="ar"
                dir="rtl"
              >
                {site.arabicName}
              </p>
              <Eyebrow onDark className="mt-8 justify-center">
                La nouvelle mosquée
              </Eyebrow>
              <h1 className="mt-7 font-display text-[3.2rem] leading-[0.98] font-medium tracking-[-0.02em] sm:text-7xl lg:text-8xl">
                Un projet de toute
                <br />
                <em className="font-light italic">une communauté</em>
              </h1>
              <p className="mt-8 max-w-2xl text-[1.05rem] leading-[1.85] text-ivory/90">
                De la fondation de l’association en{" "}
                {site.association.foundedYear} à l’ouverture au Ramadan 2026, la
                mosquée Omar Ibn al Khattab est née de la constance et de la
                générosité des fidèles de Creil.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <ButtonLink href="/galerie" variant="inverse">
                  La mosquée en images
                </ButtonLink>
                <ButtonLink href="/dons" variant="onDark">
                  Soutenir le projet
                </ButtonLink>
              </div>
            </div>
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
              <div className="mx-auto max-w-3xl">
                <Eyebrow className="justify-center">
                  Le mot de l’association
                </Eyebrow>
                <div
                  className="wp-prose mt-8"
                  dangerouslySetInnerHTML={{ __html: wpPage.contentHtml }}
                />
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* Les photographies du chantier vivent sur /galerie : les répéter ici
          faisait doublon avec la page qui leur est consacrée. */}

      {/* Appel final digne */}
      <section
        aria-label="Soutenir l’achèvement du projet"
        className="on-dark relative overflow-hidden bg-ink py-24 text-ivory lg:py-32"
      >
        <div aria-hidden className="pattern-zellige absolute inset-0" />
        <Container className="relative text-center">
          <Reveal>
            <Eyebrow onDark className="justify-center">
              Achever ce qui a été commencé
            </Eyebrow>
            <h2 className="mx-auto mt-7 max-w-3xl font-display text-[2.8rem] leading-[1.02] font-medium sm:text-5xl lg:text-6xl">
              Il reste les façades, le parking
              <br />
              <em className="font-light italic">et les espaces verts</em>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[0.98rem] leading-[1.85] text-ivory/90">
              La mosquée est ouverte, mais le projet n’est pas terminé. Votre
              soutien permet d’achever ce que la communauté a commencé ensemble.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/dons" variant="inverse">
                Faire un don
              </ButtonLink>
              <ButtonLink href="/contact" variant="onDark">
                Contacter la mosquée
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
