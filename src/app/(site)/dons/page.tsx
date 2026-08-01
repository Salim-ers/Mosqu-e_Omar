import type { Metadata } from "next";

import { FormulaireDon } from "@/components/dons/FormulaireDon";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Faire un don",
  description:
    "Soutenir la mosquée Omar Ibn al Khattab de Creil : don ponctuel, soutien mensuel ou don en main propre. Don déductible des impôts à 66 %.",
  alternates: { canonical: "/dons" },
};

export const revalidate = 3600;

export default async function DonsPage() {
  const settings = await getSettings();
  const adresse = `${settings.address.street}, ${settings.address.postalCode} ${settings.address.city}`;

  return (
    <>
      <PageHeader
        eyebrow="Soutenir la mosquée"
        title={
          <>
            Votre don
            <br />
            <em className="font-light italic">fait vivre ce lieu</em>
          </>
        }
        lead="La mosquée Omar a été construite grâce aux dons des fidèles — et c’est encore par eux qu’elle vit chaque jour. Chaque contribution compte, quel qu’en soit le montant."
      />

      {/* Le don se fait ici même : le donateur ne quitte pas la mosquée pour
          aller donner ailleurs. Le paiement, lui, reste chez la plateforme de
          l'association — c'est elle qui émet les reçus fiscaux. */}
      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-4xl font-medium text-charcoal sm:text-5xl">
                Don ponctuel
              </h2>
              <p className="mt-4 text-[0.98rem] leading-[1.85] text-charcoal/70">
                Un don libre, du montant de votre choix, par carte bancaire.
                Paiement sécurisé, reçu fiscal envoyé par courriel.
              </p>
              <div className="mt-10">
                <FormulaireDon
                  url={settings.donationUrl}
                  titre="Formulaire de don à la mosquée Omar Ibn al Khattab"
                  libelleBouton="Faire un don en ligne"
                />
              </div>
            </div>
          </Reveal>

          <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-2">
            <Reveal delay={0.06} className="h-full">
              <article className="flex h-full flex-col justify-between border border-ink bg-ink p-8 text-ivory">
                <div className="on-dark">
                  <h2 className="font-display text-2xl font-medium text-ivory">
                    Soutien mensuel
                  </h2>
                  <p className="mt-4 text-[0.9rem] leading-[1.8] text-ivory/90">
                    Un engagement régulier — {site.donation.monthlySuggestion}{" "}
                    suggérés — qui couvre l’eau, l’électricité, l’entretien et
                    les frais de fonctionnement de la mosquée.
                  </p>
                </div>
                <div className="mt-8">
                  <ButtonLink
                    href="/dons/mensuel"
                    variant="onDark"
                    className="w-full border-ivory bg-ivory text-charcoal hover:bg-transparent hover:text-ivory"
                  >
                    Soutenir chaque mois
                  </ButtonLink>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.12} className="h-full">
              <article className="flex h-full flex-col justify-between border hairline bg-cream p-8">
                <div>
                  <h2 className="font-display text-2xl font-medium text-charcoal">
                    Don en main propre
                  </h2>
                  <p className="mt-4 text-[0.9rem] leading-[1.8] text-charcoal/68">
                    Vous pouvez remettre votre don directement à la mosquée :{" "}
                    {adresse}.
                  </p>
                </div>
                <div className="mt-8">
                  <ButtonLink href="/contact" variant="outline" className="w-full">
                    Nous trouver
                  </ButtonLink>
                </div>
              </article>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="mt-16 grid gap-10 border-t hairline pt-12 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-medium text-charcoal">
                  À quoi servent vos dons
                </h2>
                <ul className="mt-6 space-y-4 text-[0.95rem] leading-[1.8] text-charcoal/70">
                  <li className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-amber"
                    />
                    Le fonctionnement quotidien : eau, électricité, entretien
                    et frais administratifs.
                  </li>
                  <li className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-amber"
                    />
                    L’achèvement des extérieurs : façades, parking et espaces
                    verts.
                  </li>
                  <li className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-amber"
                    />
                    Les activités : cours de Coran et d’arabe, soutien
                    scolaire et vie de la communauté.
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="font-display text-3xl font-medium text-charcoal">
                  Déduction fiscale
                </h2>
                <p className="mt-6 text-[0.95rem] leading-[1.85] text-charcoal/70">
                  Les dons versés à l’association {site.association.acronym}{" "}
                  sont déductibles de votre impôt sur le revenu à hauteur de{" "}
                  {site.donation.taxDeductionPercent} % du montant versé, dans
                  la limite prévue par la loi. Un reçu fiscal peut être demandé
                  à l’association ({settings.email}).
                </p>
                <p className="mt-4 text-[0.82rem] leading-relaxed text-taupe">
                  Exemple : un don de 100 € ne vous revient qu’à 34 € après
                  déduction.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
