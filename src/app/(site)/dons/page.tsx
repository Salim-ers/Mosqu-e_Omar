import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";
import { getSettings, type EffectiveSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Faire un don",
  description:
    "Soutenir la mosquée Omar Ibn al Khattab de Creil : don ponctuel, soutien mensuel ou don en main propre. Don déductible des impôts à 66 %.",
  alternates: { canonical: "/dons" },
};

/** Les adresses de don se règlent depuis l'espace bénévoles. */
function ways(settings: EffectiveSettings) {
  const address = `${settings.address.street}, ${settings.address.postalCode} ${settings.address.city}`;
  return [
    {
      title: "Don ponctuel",
      note: "Un don libre, du montant de votre choix, via le formulaire sécurisé de la mosquée.",
      href: settings.donationUrl,
      external: true,
      cta: "Faire un don en ligne",
      primary: true,
    },
    {
      title: "Soutien mensuel",
      note: `Un engagement régulier — ${site.donation.monthlySuggestion} suggérés — qui couvre l’eau, l’électricité, l’entretien et les frais de fonctionnement de la mosquée.`,
      href: settings.monthlyDonationUrl,
      external: true,
      cta: "Soutenir chaque mois",
      primary: false,
    },
    {
      title: "Don en main propre",
      note: `Vous pouvez remettre votre don directement à la mosquée : ${address}.`,
      href: "/contact",
      external: false,
      cta: "Nous trouver",
      primary: false,
    },
  ];
}

export const revalidate = 3600;

export default async function DonsPage() {
  const settings = await getSettings();
  const WAYS = ways(settings);

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

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {WAYS.map((way, index) => (
              <Reveal key={way.title} delay={index * 0.07} className="h-full">
                <article
                  className={
                    way.primary
                      ? "flex h-full flex-col justify-between border border-ink bg-ink p-8 text-ivory sm:p-10"
                      : "flex h-full flex-col justify-between border hairline bg-cream p-8 sm:p-10"
                  }
                >
                  <div className={way.primary ? "on-dark" : undefined}>
                    <p
                      className={`flex items-center gap-3 text-[0.64rem] font-semibold tracking-[0.28em] uppercase ${way.primary ? "text-ivory/55" : "text-taupe"}`}
                    >
                      <span
                        aria-hidden
                        className={`h-1.5 w-1.5 rotate-45 ${way.primary ? "bg-amber" : "bg-beige"}`}
                      />
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2
                      className={`mt-5 font-display text-3xl font-medium ${way.primary ? "text-ivory" : "text-charcoal"}`}
                    >
                      {way.title}
                    </h2>
                    <p
                      className={`mt-4 text-[0.92rem] leading-[1.8] ${way.primary ? "text-ivory/70" : "text-charcoal/68"}`}
                    >
                      {way.note}
                    </p>
                  </div>
                  <div className="mt-9">
                    <ButtonLink
                      href={way.href}
                      external={way.external}
                      variant={way.primary ? "onDark" : "outline"}
                      className={
                        way.primary
                          ? "w-full border-ivory bg-ivory text-charcoal hover:bg-transparent hover:text-ivory"
                          : "w-full"
                      }
                    >
                      {way.cta}
                    </ButtonLink>
                  </div>
                </article>
              </Reveal>
            ))}
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
