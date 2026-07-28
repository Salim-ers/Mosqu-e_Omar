import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Les grands rendez-vous de la mosquée Omar Ibn al Khattab de Creil : Ramadan, Aïd, conférences et moments de la communauté.",
  alternates: { canonical: "/evenements" },
};

/**
 * Les événements ponctuels (annonces datées) sont publiés via la page
 * Actualités et MAWAQIT. Cette page présente les rendez-vous récurrents de
 * l'année — sans dates précises inventées : les dates exactes sont toujours
 * annoncées par la mosquée.
 */
const RECURRING = [
  {
    label: "Ramadan",
    note: "Prières de tarawih chaque soir et iftars partagés à la mosquée tout au long du mois béni.",
  },
  {
    label: "Aïd al-Fitr & Aïd al-Adha",
    note: "Salat Al-Aïd rassemble toute la communauté — l’horaire est annoncé quelques jours avant via MAWAQIT.",
  },
  {
    label: "Jumu‘a",
    note: "Chaque vendredi, le sermon puis la prière réunissent les fidèles de Creil et des environs.",
  },
  {
    label: "Conférences & rappels",
    note: "Des dourous et rencontres ponctuent l’année, annoncés sur place et dans les actualités.",
  },
];

export default function EvenementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Événements"
        title={
          <>
            Les grands
            <br />
            <em className="font-light italic">rendez-vous</em>
          </>
        }
        lead="Les dates précises des événements sont annoncées par la mosquée — sur place, via MAWAQIT et dans les actualités du site."
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <ul className="border-t hairline">
            {RECURRING.map((event, index) => (
              <li key={event.label} className="border-b hairline">
                <Reveal delay={index * 0.05}>
                  <div className="grid gap-3 py-9 sm:grid-cols-12 sm:items-baseline sm:gap-8 lg:py-11">
                    <span
                      aria-hidden
                      className="font-display text-xl italic text-beige sm:col-span-1"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-3xl leading-tight font-medium text-charcoal sm:col-span-4 sm:text-4xl">
                      {event.label}
                    </h2>
                    <p className="text-[0.95rem] leading-[1.8] text-charcoal/68 sm:col-span-7">
                      {event.note}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-wrap gap-4">
              <ButtonLink href="/actualites">Voir les actualités</ButtonLink>
              <ButtonLink
                href={site.mawaqit.pageUrl}
                external
                variant="outline"
              >
                Annonces sur MAWAQIT
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
