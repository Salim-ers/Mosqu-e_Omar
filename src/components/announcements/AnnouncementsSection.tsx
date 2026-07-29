import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getActiveAnnouncements } from "@/lib/announcements";
import { formatDate } from "@/lib/dates";

/**
 * MESSAGE / ACTUALITÉ IMPORTANTE, sur fond clair — la mosaïque est réservée au
 * bloc des prochains rendez-vous, juste en dessous : deux blocs sombres à la
 * suite se seraient confondus.
 *
 * Seules les annonces actives (fenêtre publishedAt / startsAt / endsAt)
 * apparaissent : rien d'obsolète ne peut rester affiché en page d'accueil.
 */
export async function AnnouncementsSection({
  number = "03",
}: {
  number?: string;
}) {
  const announcements = await getActiveAnnouncements();
  if (announcements.length === 0) return null;

  return (
    <section
      aria-labelledby="annonces-titre"
      className="border-y hairline bg-cream py-16 lg:py-20"
    >
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Eyebrow number={number}>Annonces de la mosquée</Eyebrow>
            <Link
              href="/actualites"
              className="link-editorial text-[0.75rem] font-semibold tracking-[0.2em] text-charcoal/65 uppercase hover:text-charcoal"
            >
              Toutes les actualités
            </Link>
          </div>
          <h2 id="annonces-titre" className="sr-only">
            Annonces de la mosquée
          </h2>
        </Reveal>

        <div className="mt-10 space-y-0">
          {announcements.slice(0, 3).map((a, index) => (
            <Reveal key={a.id} delay={index * 0.06}>
              <article className="zellige-hover grid gap-4 border-t hairline py-8 first:border-t-0 sm:grid-cols-12 sm:gap-8">
                <div className="sm:col-span-3">
                  <time
                    dateTime={a.publishedAt}
                    className="text-[0.82rem] font-semibold tracking-[0.18em] text-taupe uppercase"
                  >
                    {formatDate(a.publishedAt)}
                  </time>
                  {a.isPinned ? (
                    <p className="mt-3 inline-flex items-center gap-2 rounded-[2px] bg-gold px-2.5 py-1.5 text-[0.62rem] font-semibold tracking-[0.24em] text-ink uppercase">
                      <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-ink" />
                      À la une
                    </p>
                  ) : null}
                </div>
                <div className="sm:col-span-9">
                  <h3 className="font-display text-3xl leading-snug font-medium text-charcoal sm:text-4xl">
                    {a.title}
                  </h3>
                  {a.body ? (
                    <p className="mt-3 max-w-2xl text-[1rem] leading-[1.8] text-charcoal/75">
                      {a.body}
                    </p>
                  ) : null}
                  {a.href ? (
                    <Link
                      href={a.href}
                      className="link-editorial mt-5 inline-block text-[0.76rem] font-semibold tracking-[0.2em] text-charcoal uppercase"
                    >
                      {a.hrefLabel ?? "En savoir plus"}
                    </Link>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
