import { MawaqitEmbed } from "@/components/prayer/MawaqitEmbed";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";

/**
 * 02 — HORAIRES DE PRIÈRE. Placée immédiatement sous le hero : c'est
 * l'information la plus recherchée. Jumu‘a mise en évidence.
 */
export function PrayerSection({ number = "02" }: { number?: string }) {
  return (
    <section
      id="horaires"
      aria-labelledby="horaires-titre"
      className="relative bg-ivory py-24 lg:py-32"
    >
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                number={number}
                eyebrow="Horaires de prière"
                title={
                  <span id="horaires-titre">
                    Aujourd’hui,
                    <br />
                    <em className="font-light italic">à Creil</em>
                  </span>
                }
                lead="Les horaires affichés sont ceux communiqués par la Mosquée Omar via MAWAQIT, la plateforme officielle utilisée par la mosquée. Ils font foi pour les cinq prières quotidiennes."
              />
            </Reveal>

            {/* Jumu‘a — mise en valeur */}
            <Reveal delay={0.1}>
              <div className="mt-10 border hairline bg-cream p-7 shadow-[var(--shadow-soft)] sm:p-8">
                <p className="flex items-center gap-4 text-[0.66rem] font-semibold tracking-[0.28em] text-amber uppercase">
                  <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-amber" />
                  Vendredi — Jumu‘a
                </p>
                <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  {site.mawaqit.jumua ? (
                    <p className="font-display text-6xl leading-none font-medium text-charcoal">
                      {site.mawaqit.jumua}
                    </p>
                  ) : null}
                  <p className="max-w-[16rem] text-[0.85rem] leading-relaxed text-charcoal/60">
                    Horaire annoncé par la mosquée — confirmé chaque semaine
                    sur MAWAQIT.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/horaires" variant="outline">
                  Page des horaires
                </ButtonLink>
                <a
                  href={site.mawaqit.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-editorial self-center text-[0.72rem] font-semibold tracking-[0.2em] text-charcoal/70 uppercase hover:text-charcoal"
                >
                  Voir tous les horaires sur MAWAQIT ↗
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.08} className="lg:pl-6">
              <MawaqitEmbed />
              <p className="mt-4 text-[0.78rem] leading-relaxed text-taupe">
                Source officielle : MAWAQIT — Mosquée Omar ibn al Khattab,
                Creil (ID {site.mawaqit.mosqueId}).
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
