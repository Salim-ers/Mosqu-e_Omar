import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { MawaqitEmbed } from "@/components/prayer/MawaqitEmbed";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Horaires de prière",
  description:
    "Horaires officiels des cinq prières et de la Jumu‘a à la mosquée Omar Ibn al Khattab de Creil, communiqués via MAWAQIT.",
  alternates: { canonical: "/horaires" },
};

export default function HorairesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Horaires de prière"
        title={
          <>
            Les horaires
            <br />
            <em className="font-light italic">de la mosquée</em>
          </>
        }
        lead="Les horaires affichés ci-dessous sont ceux communiqués par la Mosquée Omar via MAWAQIT, la plateforme officielle utilisée par la mosquée. Le site ne calcule ni ne modifie aucun horaire : MAWAQIT fait foi."
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <Reveal>
                <MawaqitEmbed tall />
                <p className="mt-4 text-[0.78rem] leading-relaxed text-taupe">
                  Source officielle : MAWAQIT — Mosquée Omar ibn al Khattab,
                  Creil (ID {site.mawaqit.mosqueId}). En cas d’écart, les
                  horaires annoncés à la mosquée prévalent.
                </p>
              </Reveal>
            </div>

            <aside className="space-y-8 lg:col-span-4">
              <Reveal delay={0.08}>
                <div className="border hairline bg-cream p-7 shadow-[var(--shadow-soft)]">
                  <p className="flex items-center gap-4 text-[0.66rem] font-semibold tracking-[0.28em] text-amber uppercase">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rotate-45 bg-amber"
                    />
                    Vendredi — Jumu‘a
                  </p>
                  {site.mawaqit.jumua ? (
                    <p className="mt-4 font-display text-6xl leading-none font-medium text-charcoal">
                      {site.mawaqit.jumua}
                    </p>
                  ) : null}
                  <p className="mt-4 text-[0.85rem] leading-relaxed text-charcoal/60">
                    Horaire annoncé par la mosquée — confirmé chaque semaine
                    sur MAWAQIT. Venez tôt : la salle se remplit rapidement.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="border-t hairline pt-7">
                  <h2 className="font-display text-2xl font-medium text-charcoal">
                    Sur votre téléphone
                  </h2>
                  <p className="mt-3 text-[0.9rem] leading-[1.8] text-charcoal/65">
                    Retrouvez la mosquée Omar dans l’application MAWAQIT pour
                    recevoir les horaires et les annonces directement.
                  </p>
                  <ButtonLink
                    href={site.mawaqit.pageUrl}
                    external
                    variant="outline"
                    className="mt-6"
                  >
                    Voir tous les horaires sur MAWAQIT
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="border-t hairline pt-7">
                  <h2 className="font-display text-2xl font-medium text-charcoal">
                    Bon à savoir
                  </h2>
                  <ul className="mt-4 space-y-3 text-[0.9rem] leading-[1.75] text-charcoal/65">
                    <li className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-beige"
                      />
                      Certains horaires (notamment Icha) peuvent être ajustés
                      selon la saison — les annonces officielles passent par
                      MAWAQIT et l’affichage de la mosquée.
                    </li>
                    <li className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-beige"
                      />
                      Un espace de prière est dédié aux sœurs, et l’accès est
                      facilité pour les personnes à mobilité réduite.
                    </li>
                  </ul>
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
