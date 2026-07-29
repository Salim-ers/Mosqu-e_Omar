import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getJanaza } from "@/lib/content";
import { formatJanazaDate } from "@/lib/dates";

/**
 * PRIÈRES FUNÉRAIRES. Bloc d'encre, très sobre, sans photographie ni fioriture
 * — il n'apparaît que lorsqu'une annonce est en cours, et disparaît de
 * lui-même quelques jours après la prière.
 */
export async function JanazaSection() {
  const janaza = await getJanaza();
  if (janaza.length === 0) return null;

  return (
    <section
      aria-labelledby="janaza-titre"
      className="on-dark relative overflow-hidden bg-ink py-16 text-ivory lg:py-20"
    >
      <div aria-hidden className="pattern-zellige absolute inset-0" />
      <Container className="relative">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Eyebrow onDark>Prière funéraire — Salat Janaza</Eyebrow>
            <Link
              href="/janaza"
              className="link-editorial text-[0.75rem] font-semibold tracking-[0.2em] text-ivory/85 uppercase hover:text-ivory"
            >
              Toutes les annonces
            </Link>
          </div>
          <h2 id="janaza-titre" className="sr-only">
            Prières funéraires annoncées par la mosquée
          </h2>
          <p
            className="mt-6 font-arabic text-xl text-ivory/90 sm:text-2xl"
            lang="ar"
            dir="rtl"
          >
            إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
          </p>
        </Reveal>

        <ul className="mt-8 border-t border-ivory/20">
          {janaza.slice(0, 3).map((entry, index) => (
            <li key={entry.id} className="zellige-hover-dark border-b border-ivory/20">
              <Reveal delay={index * 0.06}>
                <div className="grid gap-3 py-7 sm:grid-cols-12 sm:gap-8">
                  <p className="text-[0.82rem] font-semibold tracking-[0.18em] text-ivory/85 uppercase sm:col-span-4">
                    {formatJanazaDate(entry.prayerAt)}
                  </p>
                  <div className="sm:col-span-8">
                    <p className="font-display text-3xl leading-snug font-medium text-ivory sm:text-4xl">
                      {entry.name}
                    </p>
                    <p className="mt-3 text-[1.02rem] leading-relaxed text-ivory/90">
                      {entry.place}
                      {entry.burialPlace ? ` — inhumation : ${entry.burialPlace}` : ""}
                    </p>
                    {entry.note ? (
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-ivory/75">
                        {entry.note}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
