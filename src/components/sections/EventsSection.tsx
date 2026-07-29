import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getEvents, type PublicEvent } from "@/lib/content";
import { formatDate } from "@/lib/dates";

/**
 * LES PROCHAINS RENDEZ-VOUS, sur fond de mosaïque. N'apparaît que lorsqu'un
 * événement est annoncé — un Aïd, un iftar, une conférence. C'est
 * l'information que l'on vient chercher juste après les horaires : elle a sa
 * place sur l'accueil, pas seulement au fond de la page Événements.
 *
 * Un filet clair marque le haut de la section : le motif de mosaïque repart à
 * chaque bloc, et la jonction entre deux blocs sombres doit se lire comme un
 * trait voulu plutôt que comme un raccord manqué.
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
      className="on-dark relative overflow-hidden border-t border-ivory/12 bg-ink py-20 text-ivory lg:py-28"
    >
      <div aria-hidden className="pattern-zellige absolute inset-0" />
      <Container className="relative">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Eyebrow onDark>Prochains rendez-vous</Eyebrow>
            <Link
              href="/evenements"
              className="link-editorial text-[0.75rem] font-semibold tracking-[0.2em] text-ivory/85 uppercase hover:text-ivory"
            >
              Tous les événements
            </Link>
          </div>
          <h2 id="evenements-titre" className="sr-only">
            Prochains événements de la mosquée
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <article className="mt-10 grid items-center gap-10 border-t border-ivory/20 pt-10 lg:grid-cols-12 lg:gap-14">
            <div className={premier.image ? "lg:col-span-7" : "lg:col-span-12"}>
              <p className="flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.24em] text-ivory/85 uppercase">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold" />
                {LIBELLES[premier.kind]}
              </p>
              <h3 className="mt-4 font-display text-[3rem] leading-[1.02] font-medium text-ivory sm:text-6xl">
                {premier.title}
              </h3>
              <p className="mt-5 text-[1.05rem] text-ivory/90">
                <time dateTime={premier.startsAt}>
                  {formatDate(premier.startsAt)}
                </time>
                {premier.timeLabel ? ` — ${premier.timeLabel}` : null}
                {premier.place ? ` · ${premier.place}` : null}
              </p>
              {premier.description ? (
                <p className="mt-4 max-w-xl text-[1rem] leading-[1.8] text-ivory/80">
                  {premier.description}
                </p>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/evenements" variant="inverse">
                  {premier.hrefLabel || "En savoir plus"}
                </ButtonLink>
              </div>
            </div>

            {premier.image ? (
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-ink/40 ring-1 ring-ivory/15">
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
          <ul className="mt-4 border-t border-ivory/20">
            {suivants.map((event, index) => (
              <li
                key={event.id}
                className="zellige-hover-dark border-b border-ivory/20"
              >
                <Reveal delay={0.06 + index * 0.05}>
                  <div className="grid gap-2 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-8">
                    <p className="text-[0.82rem] font-semibold tracking-[0.18em] text-ivory/85 uppercase sm:col-span-4">
                      {formatDate(event.startsAt)}
                    </p>
                    <h3 className="font-display text-2xl leading-tight font-medium text-ivory sm:col-span-5 sm:text-3xl">
                      {event.title}
                    </h3>
                    <p className="text-[0.95rem] text-ivory/80 sm:col-span-3">
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
