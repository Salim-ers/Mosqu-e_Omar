import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getEvents, type PublicEvent } from "@/lib/content";
import { formatDate } from "@/lib/dates";

/**
 * LES PROCHAINS RENDEZ-VOUS. N'apparaît que lorsqu'un événement est annoncé —
 * un Aïd, un iftar, une conférence. C'est l'information que l'on vient
 * chercher en premier après les horaires : elle a sa place sur l'accueil, pas
 * seulement au fond de la page Événements.
 */
const LIBELLES: Record<PublicEvent["kind"], string> = {
  aid: "Aïd",
  ramadan: "Ramadan",
  conference: "Conférence",
  collecte: "Collecte",
  repas: "Repas",
  autre: "Événement",
};

export async function EventsSection() {
  const { upcoming } = await getEvents();
  if (upcoming.length === 0) return null;

  const [premier, ...suivants] = upcoming.slice(0, 3);

  return (
    <section
      aria-labelledby="evenements-titre"
      className="border-t hairline bg-cream py-20 lg:py-28"
    >
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Eyebrow>Prochains rendez-vous</Eyebrow>
            <Link
              href="/evenements"
              className="link-editorial text-[0.72rem] font-semibold tracking-[0.2em] text-charcoal/60 uppercase hover:text-charcoal"
            >
              Tous les événements
            </Link>
          </div>
          <h2 id="evenements-titre" className="sr-only">
            Prochains événements de la mosquée
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <article className="mt-10 grid items-center gap-10 border-t hairline pt-10 lg:grid-cols-12 lg:gap-14">
            <div className={premier.image ? "lg:col-span-7" : "lg:col-span-12"}>
              <p className="flex items-center gap-3 text-[0.66rem] font-semibold tracking-[0.24em] text-taupe uppercase">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-amber" />
                {LIBELLES[premier.kind]}
              </p>
              <h3 className="mt-4 font-display text-[2.6rem] leading-[1.05] font-medium text-charcoal sm:text-5xl">
                {premier.title}
              </h3>
              <p className="mt-4 text-[1rem] text-charcoal/75">
                <time dateTime={premier.startsAt}>
                  {formatDate(premier.startsAt)}
                </time>
                {premier.timeLabel ? ` — ${premier.timeLabel}` : null}
                {premier.place ? ` · ${premier.place}` : null}
              </p>
              {premier.description ? (
                <p className="mt-4 max-w-xl text-[0.98rem] leading-[1.8] text-charcoal/68">
                  {premier.description}
                </p>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/evenements">
                  {premier.hrefLabel || "En savoir plus"}
                </ButtonLink>
              </div>
            </div>

            {premier.image ? (
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
                  <Image
                    src={premier.image.url}
                    alt={premier.image.alt}
                    fill
                    sizes="(min-width: 1024px) 38vw, 92vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}
          </article>
        </Reveal>

        {suivants.length > 0 ? (
          <ul className="mt-4 border-t hairline">
            {suivants.map((event, index) => (
              <li key={event.id} className="zellige-hover border-b hairline">
                <Reveal delay={0.06 + index * 0.05}>
                  <div className="grid gap-2 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-8">
                    <p className="text-[0.72rem] font-semibold tracking-[0.2em] text-taupe uppercase sm:col-span-4">
                      {formatDate(event.startsAt)}
                    </p>
                    <h3 className="font-display text-2xl leading-tight font-medium text-charcoal sm:col-span-5 sm:text-3xl">
                      {event.title}
                    </h3>
                    <p className="text-[0.9rem] text-charcoal/60 sm:col-span-3">
                      {event.timeLabel || event.place}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
