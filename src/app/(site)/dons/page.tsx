import type { Metadata } from "next";

import { CadreDon } from "@/components/dons/CadreDon";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Faire un don",
  description:
    "Soutenir la mosquée Omar Ibn al Khattab de Creil : don en ligne, par virement ou en main propre. Don déductible des impôts à 66 %.",
  alternates: { canonical: "/dons" },
};

export const revalidate = 3600;

export default async function DonsPage() {
  const reglages = await getSettings();
  const adresse = `${reglages.address.street}, ${reglages.address.postalCode} ${reglages.address.city}`;

  return (
    <>
      <PageHeader
        eyebrow="Soutenir la mosquée"
        title={
          <>
            La mosquée est ouverte,
            <br />
            <em className="font-light italic">le projet continue</em>
          </>
        }
        lead="Al hamdoulillah, c’est grâce à vos dons que la mosquée Omar a ouvert ses portes avant le Ramadan. Le projet n’est pas terminé pour autant : il reste l’extérieur — les façades, le parking et les espaces verts."
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="font-display text-4xl font-medium text-charcoal sm:text-5xl">
                  Don ponctuel
                </h2>
                <p className="mt-4 max-w-xl text-[0.98rem] leading-[1.85] text-charcoal/70">
                  Du montant de votre choix, quand vous le souhaitez. Chaque
                  contribution compte, quelle qu’elle soit.
                </p>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="mt-9">
                  <CadreDon
                    url={reglages.donationUrl}
                    titre="Formulaire de don à la mosquée Omar Ibn al Khattab"
                    libelleBouton="Faire un don"
                  />
                </div>
              </Reveal>

              {/* En noir sous le formulaire clair : le soutien mensuel ne se
                  fond plus dans la page, il s'y détache. */}
              <Reveal delay={0.1}>
                <div className="on-dark relative mt-10 overflow-hidden border border-ink bg-ink p-8 text-ivory sm:p-10">
                  <div aria-hidden className="pattern-zellige absolute inset-0" />
                  <div className="relative">
                    <h3 className="font-display text-2xl font-medium text-ivory">
                      L’aumône continue
                    </h3>
                    <p className="mt-4 max-w-md text-[0.92rem] leading-[1.8] text-ivory/85">
                      Vous pouvez aussi soutenir la mosquée chaque mois. C’est
                      cette régularité, plus que les grands gestes, qui permet
                      de faire face aux charges du lieu.
                    </p>
                    <div className="mt-8">
                      <ButtonLink href="/dons/mensuel" variant="inverse">
                        Soutenir chaque mois
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <aside className="lg:col-span-5">
              <Reveal delay={0.08}>
                <h2 className="font-display text-3xl font-medium text-charcoal">
                  Comment participer
                </h2>
                <dl className="mt-7 border-t hairline">
                  <div className="zellige-hover border-b hairline py-6">
                    <dt className="font-display text-xl font-medium text-charcoal">
                      En ligne
                    </dt>
                    <dd className="mt-2 text-[0.9rem] leading-[1.8] text-charcoal/65">
                      Par carte bancaire, avec le bouton ci-contre. Paiement
                      sécurisé, reçu envoyé par courriel.
                    </dd>
                  </div>
                  <div className="zellige-hover border-b hairline py-6">
                    <dt className="font-display text-xl font-medium text-charcoal">
                      Par virement
                    </dt>
                    <dd className="mt-2 text-[0.9rem] leading-[1.8] text-charcoal/65">
                      Demandez le relevé d’identité bancaire de l’association à{" "}
                      <a
                        href={`mailto:${reglages.email}`}
                        className="underline underline-offset-4 hover:text-charcoal"
                      >
                        {reglages.email}
                      </a>
                      .
                    </dd>
                  </div>
                  <div className="zellige-hover border-b hairline py-6">
                    <dt className="font-display text-xl font-medium text-charcoal">
                      En main propre
                    </dt>
                    <dd className="mt-2 text-[0.9rem] leading-[1.8] text-charcoal/65">
                      À la mosquée, {adresse}.
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="mt-10 border-t hairline pt-8">
                  <h2 className="font-display text-2xl font-medium text-charcoal">
                    Déduction fiscale
                  </h2>
                  <p className="mt-4 text-[0.9rem] leading-[1.85] text-charcoal/70">
                    Les dons versés à l’association {site.association.acronym}{" "}
                    sont déductibles de votre impôt sur le revenu à hauteur de{" "}
                    {site.donation.taxDeductionPercent} % du montant versé, dans
                    la limite prévue par la loi. Un reçu fiscal peut être demandé
                    à l’association.
                  </p>
                  <p className="mt-3 text-[0.82rem] leading-relaxed text-taupe">
                    Un don de 100 € ne vous revient qu’à 34 € après déduction.
                  </p>
                </div>
              </Reveal>
            </aside>
          </div>

          <Reveal delay={0.12}>
            <div className="mt-16 border-t hairline pt-12">
              <h2 className="font-display text-3xl font-medium text-charcoal">
                À quoi servent vos dons
              </h2>
              <ul className="mt-6 grid gap-4 text-[0.95rem] leading-[1.8] text-charcoal/70 sm:grid-cols-3 sm:gap-8">
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
                  Le fonctionnement quotidien : eau, électricité, entretien et
                  frais administratifs.
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-amber"
                  />
                  Les activités : cours de Coran et d’arabe, soutien scolaire et
                  vie de la communauté.
                </li>
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
