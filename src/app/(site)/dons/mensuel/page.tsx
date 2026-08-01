import type { Metadata } from "next";

import { FormulaireDon } from "@/components/dons/FormulaireDon";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Soutien mensuel",
  description:
    "Soutenir chaque mois la mosquée Omar Ibn al Khattab de Creil : un don régulier qui couvre l’eau, l’électricité, l’entretien et le fonctionnement du lieu.",
  alternates: { canonical: "/dons/mensuel" },
};

export const revalidate = 3600;

/** Ce que le don mensuel finance — les charges qui reviennent chaque mois. */
const CHARGES = [
  {
    label: "L’eau et l’électricité",
    note: "Le chauffage de la salle de prière en hiver, l’eau des ablutions toute l’année.",
  },
  {
    label: "L’entretien",
    note: "Le ménage quotidien, les tapis, les petites réparations, les consommables.",
  },
  {
    label: "Le fonctionnement",
    note: "Les assurances, les frais administratifs et les moyens donnés aux enseignants.",
  },
];

export default async function DonMensuelPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Soutenir la mosquée"
        title={
          <>
            Soutenir
            <br />
            <em className="font-light italic">chaque mois</em>
          </>
        }
        lead={`Une mosquée ne vit pas de grands gestes ponctuels, mais de la régularité de ceux qui la font tenir. ${site.donation.monthlySuggestion} suffisent à couvrir une part des charges — et ce montant reste le vôtre, modifiable ou interrompu à tout moment.`}
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <FormulaireDon
                url={settings.monthlyDonationUrl}
                titre="Formulaire de soutien mensuel à la mosquée Omar Ibn al Khattab"
                libelleBouton="Soutenir chaque mois"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mx-auto mt-16 max-w-3xl border-t hairline pt-12">
              <h2 className="font-display text-3xl font-medium text-charcoal">
                Ce que votre soutien couvre
              </h2>
              <ul className="mt-7 border-t hairline">
                {CHARGES.map((charge) => (
                  <li key={charge.label} className="zellige-hover border-b hairline">
                    <div className="grid gap-2 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                      <h3 className="font-display text-2xl font-medium text-charcoal sm:col-span-5">
                        {charge.label}
                      </h3>
                      <p className="text-[0.9rem] leading-[1.75] text-charcoal/65 sm:col-span-7">
                        {charge.note}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mx-auto mt-14 max-w-3xl">
              <h2 className="font-display text-3xl font-medium text-charcoal">
                Déduction fiscale
              </h2>
              <p className="mt-6 text-[0.95rem] leading-[1.85] text-charcoal/70">
                Comme les dons ponctuels, votre soutien mensuel est déductible
                de votre impôt sur le revenu à hauteur de{" "}
                {site.donation.taxDeductionPercent} % du montant versé, dans la
                limite prévue par la loi. Un reçu fiscal récapitulant l’année
                peut être demandé à l’association ({settings.email}).
              </p>
              <p className="mt-4 text-[0.82rem] leading-relaxed text-taupe">
                Exemple : {site.donation.monthlySuggestion}, soit 240 € sur
                l’année, ne vous reviennent qu’à 81,60 € après déduction.
              </p>
              <div className="mt-9">
                <ButtonLink href="/dons" variant="outline">
                  Faire plutôt un don ponctuel
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
