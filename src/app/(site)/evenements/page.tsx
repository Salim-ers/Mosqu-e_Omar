import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";
import { getEvents, type PublicEvent } from "@/lib/content";
import { formatDate } from "@/lib/dates";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Les grands rendez-vous de la mosquée Omar Ibn al Khattab de Creil : Ramadan, Aïd, conférences et moments de la communauté.",
  alternates: { canonical: "/evenements" },
};

const KIND_LABELS: Record<PublicEvent["kind"], string> = {
  aid: "Aïd",
  ramadan: "Ramadan",
  conference: "Conférence",
  collecte: "Collecte",
  repas: "Repas",
  autre: "Événement",
};

/**
 * Les rendez-vous annoncés par la mosquée (saisis dans l'espace bénévoles)
 * passent en premier ; les rendez-vous récurrents de l'année restent affichés
 * en dessous — sans jamais inventer de date.
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

export default async function EvenementsPage() {
  const { upcoming, past } = await getEvents();

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
        lead="Les dates annoncées par la mosquée figurent ci-dessous. À défaut de date précise, l’information est toujours confirmée sur place et via MAWAQIT."
      />

      {upcoming.length > 0 ? (
        <section aria-labelledby="a-venir" className="bg-ivory py-16 lg:py-24">
          <Container>
            <Reveal>
              <Eyebrow number="01">À venir</Eyebrow>
              <h2 id="a-venir" className="sr-only">
                Événements à venir
              </h2>
            </Reveal>
            <div className="mt-12 space-y-14">
              {upcoming.map((event, index) => (
                <Reveal key={event.id} delay={index * 0.05}>
                  <EventCard event={event} highlighted={event.isHighlighted} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section
        aria-labelledby="recurrents"
        className={`bg-ivory py-16 lg:py-24 ${upcoming.length > 0 ? "border-t hairline" : ""}`}
      >
        <Container>
          <Reveal>
            <Eyebrow number={upcoming.length > 0 ? "02" : "01"}>
              Tout au long de l’année
            </Eyebrow>
            <h2 id="recurrents" className="sr-only">
              Les rendez-vous récurrents
            </h2>
          </Reveal>

          <ul className="mt-10 border-t hairline">
            {RECURRING.map((event, index) => (
              <li key={event.label} className="border-b hairline">
                <Reveal delay={index * 0.05}>
                  <div className="grid gap-3 py-9 sm:grid-cols-12 sm:items-baseline sm:gap-8 lg:py-11">
                    <span
                      aria-hidden
                      className="font-display text-xl italic text-charcoal/30 sm:col-span-1"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-3xl leading-tight font-medium text-charcoal sm:col-span-4 sm:text-4xl">
                      {event.label}
                    </h3>
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
              <ButtonLink href={site.mawaqit.pageUrl} external variant="outline">
                Annonces sur MAWAQIT
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      {past.length > 0 ? (
        <section
          aria-labelledby="passes"
          className="border-t hairline bg-cream py-16 lg:py-20"
        >
          <Container>
            <Reveal>
              <Eyebrow>Déjà passés</Eyebrow>
              <h2 id="passes" className="sr-only">
                Événements passés
              </h2>
            </Reveal>
            <ul className="mt-8 border-t hairline">
              {past.slice(0, 8).map((event) => (
                <li
                  key={event.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b hairline py-5"
                >
                  <span className="font-display text-xl font-medium text-charcoal/70">
                    {event.title}
                  </span>
                  <time
                    dateTime={event.startsAt}
                    className="text-[0.7rem] font-semibold tracking-[0.22em] text-taupe uppercase"
                  >
                    {formatDate(event.startsAt)}
                  </time>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}

function EventCard({
  event,
  highlighted,
}: {
  event: PublicEvent;
  highlighted: boolean;
}) {
  const body = (
    <div className={highlighted ? "lg:col-span-7" : "sm:col-span-8"}>
      <p
        className={`flex items-center gap-3 text-[0.62rem] font-semibold tracking-[0.24em] uppercase ${
          highlighted ? "text-ivory/60" : "text-taupe"
        }`}
      >
        <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-amber" />
        {KIND_LABELS[event.kind]}
      </p>
      <h3
        className={`mt-4 font-display text-3xl leading-tight font-medium sm:text-4xl ${
          highlighted ? "text-ivory" : "text-charcoal"
        }`}
      >
        {event.title}
      </h3>
      <p
        className={`mt-4 text-[0.95rem] ${
          highlighted ? "text-ivory/75" : "text-charcoal/70"
        }`}
      >
        <time dateTime={event.startsAt}>{formatDate(event.startsAt)}</time>
        {event.timeLabel ? ` — ${event.timeLabel}` : null}
        {event.place ? ` · ${event.place}` : null}
      </p>
      {event.description ? (
        <p
          className={`mt-4 max-w-xl text-[0.95rem] leading-[1.8] ${
            highlighted ? "text-ivory/70" : "text-charcoal/68"
          }`}
        >
          {event.description}
        </p>
      ) : null}
      {event.href ? (
        <div className="mt-7">
          <ButtonLink
            href={event.href}
            external={/^https?:\/\//.test(event.href)}
            variant={highlighted ? "inverse" : "outline"}
          >
            {event.hrefLabel || "En savoir plus"}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );

  const picture = event.image ? (
    <div className={highlighted ? "lg:col-span-5" : "sm:col-span-4"}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        <Image
          src={event.image.url}
          alt={event.image.alt}
          fill
          sizes="(min-width: 1024px) 34vw, 92vw"
          className="object-cover"
        />
      </div>
    </div>
  ) : null;

  if (highlighted) {
    return (
      <article className="on-dark relative overflow-hidden bg-ink px-6 py-10 text-ivory sm:px-10 sm:py-12">
        <div aria-hidden className="pattern-khatam-light absolute inset-0" />
        <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {body}
          {picture}
        </div>
      </article>
    );
  }

  return (
    <article className="grid items-start gap-8 border-t hairline pt-10 sm:grid-cols-12">
      {body}
      {picture}
    </article>
  );
}
