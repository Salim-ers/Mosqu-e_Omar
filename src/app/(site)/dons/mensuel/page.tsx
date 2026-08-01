import type { Metadata } from "next";

import { CadreDon } from "@/components/dons/CadreDon";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Participation mensuelle",
  description:
    "Soutenir chaque mois la mosquée Omar Ibn al Khattab de Creil : une participation régulière qui couvre l’eau, l’électricité, l’entretien et les frais administratifs.",
  alternates: { canonical: "/dons/mensuel" },
};

export const revalidate = 3600;

/** Les charges vitales du lieu, telles que l'association les énonce. */
const CHARGES = [
  {
    label: "L’eau et l’électricité",
    note: "Les ablutions toute l’année, le chauffage de la salle de prière en hiver.",
  },
  {
    label: "L’entretien",
    note: "Le ménage quotidien, les tapis, les petites réparations, les consommables.",
  },
  {
    label: "Les frais administratifs",
    note: "Les assurances, la gestion courante et les moyens donnés aux enseignants.",
  },
];

export default async function DonMensuelPage() {
  const reglages = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Soutenir la mosquée"
        title={
          <>
            Participation
            <br />
            <em className="font-light italic">mensuelle</em>
          </>
        }
        lead="Soutenez votre mosquée de manière régulière. Votre participation aide à couvrir les charges vitales du lieu : eau, électricité, entretien et frais administratifs."
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="max-w-xl text-[1.02rem] leading-[1.9] text-charcoal/75">
                  L’idéal est une contribution de{" "}
                  {site.donation.monthlySuggestion}, mais chacun donne selon ses
                  moyens. Vous pouvez modifier ou interrompre votre soutien à
                  tout moment.
                </p>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="mt-9">
                  <CadreDon
                    url={reglages.monthlyDonationUrl}
                    titre="Formulaire de soutien mensuel à la mosquée Omar Ibn al Khattab"
                    libelleBouton="Soutenir chaque mois"
                  />
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-8 font-display text-2xl leading-snug font-medium text-charcoal italic">
                  Qu’Allah récompense votre générosité.
                </p>
              </Reveal>
            </div>

            <aside className="lg:col-span-5">
              <Reveal delay={0.08}>
                <h2 className="font-display text-3xl font-medium text-charcoal">
                  Ce que votre soutien couvre
                </h2>
                <dl className="mt-7 border-t hairline">
                  {CHARGES.map((charge) => (
                    <div
                      key={charge.label}
                      className="zellige-hover border-b hairline py-6"
                    >
                      <dt className="font-display text-xl font-medium text-charcoal">
                        {charge.label}
                      </dt>
                      <dd className="mt-2 text-[0.9rem] leading-[1.8] text-charcoal/65">
                        {charge.note}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="mt-10 border-t hairline pt-8">
                  <h2 className="font-display text-2xl font-medium text-charcoal">
                    Déduction fiscale
                  </h2>
                  <p className="mt-4 text-[0.9rem] leading-[1.85] text-charcoal/70">
                    Comme les dons ponctuels, votre soutien mensuel est
                    déductible de votre impôt sur le revenu à hauteur de{" "}
                    {site.donation.taxDeductionPercent} % du montant versé. Un
                    reçu récapitulant l’année peut être demandé à l’association
                    ({reglages.email}).
                  </p>
                  <p className="mt-3 text-[0.82rem] leading-relaxed text-taupe">
                    {site.donation.monthlySuggestion}, soit 240 € sur l’année,
                    ne vous reviennent qu’à 81,60 € après déduction.
                  </p>
                  <div className="mt-8">
                    <ButtonLink href="/dons" variant="outline">
                      Faire plutôt un don ponctuel
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
