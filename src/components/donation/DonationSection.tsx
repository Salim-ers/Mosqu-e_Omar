import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/config/site";
import { getSettings } from "@/lib/content";

/**
 * 09 — SOUTENIR LA MOSQUÉE. Sobre et digne : on explique d'abord à quoi
 * servent les dons, puis on propose d'agir. Aucune urgence artificielle,
 * aucun compteur, aucun dark pattern.
 */

const PURPOSES = [
  {
    label: "Faire vivre le lieu",
    note: "Eau, électricité, entretien et frais de fonctionnement quotidiens de la mosquée.",
  },
  {
    label: "Achever les extérieurs",
    note: "Façades, parking et espaces verts — les dernières étapes du projet.",
  },
  {
    label: "Transmettre",
    note: "Soutenir les cours de Coran, d’arabe et le soutien scolaire offerts à la communauté.",
  },
];

export async function DonationSection({ number = "09" }: { number?: string }) {
  const settings = await getSettings();

  return (
    <section
      aria-labelledby="don-titre"
      className="on-dark relative overflow-hidden bg-ink py-24 text-ivory lg:py-36"
    >
      <div aria-hidden className="pattern-zellige absolute inset-0" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow number={number} onDark>
                Soutenir la mosquée
              </Eyebrow>
              <h2
                id="don-titre"
                className="mt-6 font-display text-[2.6rem] leading-[1.04] font-medium tracking-[-0.01em] text-ivory sm:text-5xl lg:text-6xl"
              >
                Votre don fait vivre
                <br />
                <em className="font-light italic">ce lieu</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-[0.98rem] leading-[1.85] text-ivory/92">
                La mosquée Omar a été construite grâce aux dons des fidèles.
                Aujourd’hui encore, elle ne vit que par eux : chaque
                contribution, ponctuelle ou mensuelle, l’aide à accomplir sa
                mission.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/dons" variant="inverse">
                  Faire un don
                </ButtonLink>
                <ButtonLink
                  href={settings.monthlyDonationUrl}
                  external
                  variant="onDark"
                >
                  Soutenir chaque mois
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-xl text-[0.82rem] leading-relaxed text-ivory/75">
                Don déductible de vos impôts à hauteur de{" "}
                {site.donation.taxDeductionPercent} % (association loi 1901 —
                un reçu fiscal peut être demandé à l’association). Vous pouvez
                aussi déposer votre don en main propre, directement à la
                mosquée.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:pt-4">
            <ul className="border-t border-ivory/12">
              {PURPOSES.map((purpose, index) => (
                <li key={purpose.label} className="border-b border-ivory/12">
                  <Reveal delay={index * 0.06}>
                    <div className="grid gap-2 py-8 sm:grid-cols-12 sm:gap-6">
                      <span
                        aria-hidden
                        className="font-display text-lg italic text-amber sm:col-span-2"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="sm:col-span-10">
                        <h3 className="font-display text-2xl font-medium text-ivory sm:text-3xl">
                          {purpose.label}
                        </h3>
                        <p className="mt-2 max-w-md text-[0.9rem] leading-[1.75] text-ivory/85">
                          {purpose.note}
                        </p>
                      </div>
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
