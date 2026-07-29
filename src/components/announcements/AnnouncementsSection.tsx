import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getActiveAnnouncements } from "@/lib/announcements";
import { formatDate } from "@/lib/dates";

/**
 * MESSAGE / ACTUALITÉ IMPORTANTE, sur fond de mosaïque. Seules les annonces
 * actives (fenêtre publishedAt / startsAt / endsAt) apparaissent : rien
 * d'obsolète ne peut rester affiché en page d'accueil.
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
      className="on-dark relative overflow-hidden bg-ink py-16 text-ivory lg:py-20"
    >
      <div aria-hidden className="pattern-zellige absolute inset-0" />
      <Container className="relative">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Eyebrow number={number} onDark>
              Annonces de la mosquée
            </Eyebrow>
            <Link
              href="/actualites"
              className="link-editorial text-[0.75rem] font-semibold tracking-[0.2em] text-ivory/85 uppercase hover:text-ivory"
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
              <article className="zellige-hover-dark grid gap-4 border-t border-ivory/20 py-8 first:border-t-0 sm:grid-cols-12 sm:gap-8">
                <div className="sm:col-span-3">
                  <time
                    dateTime={a.publishedAt}
                    className="text-[0.82rem] font-semibold tracking-[0.18em] text-ivory/85 uppercase"
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
                  <h3 className="font-display text-3xl leading-snug font-medium text-ivory sm:text-4xl">
                    {a.title}
                  </h3>
                  {a.body ? (
                    <p className="mt-3 max-w-2xl text-[1rem] leading-[1.8] text-ivory/90">
                      {a.body}
                    </p>
                  ) : null}
                  {a.href ? (
                    <Link
                      href={a.href}
                      className="link-editorial mt-5 inline-block text-[0.76rem] font-semibold tracking-[0.2em] text-ivory uppercase"
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
