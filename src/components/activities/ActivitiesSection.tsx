import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ArchImage } from "@/components/ui/ArchImage";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getActivities } from "@/lib/content";
import { PHOTOS, src } from "@/lib/media";

/**
 * 05 — ACTIVITÉS. Traitement éditorial en sommaire : rangées typographiques
 * sous filets, index en Cormorant italique — délibérément à l'opposé des
 * petites cartes SaaS génériques. Les activités se gèrent depuis /admin.
 */
export async function ActivitiesSection({ number = "05" }: { number?: string }) {
  const activities = await getActivities();
  if (activities.length === 0) return null;

  return (
    <section
      aria-labelledby="activites-titre"
      className="border-t hairline bg-ivory py-24 lg:py-36"
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <SectionHeading
                  number={number}
                  eyebrow="Activités"
                  title={
                    <span id="activites-titre">
                      Apprendre,
                      <br />
                      <em className="font-light italic">transmettre</em>
                    </span>
                  }
                  lead="Tout au long de l’année, la mosquée propose des activités religieuses, éducatives et sociales, ouvertes à tous les membres de la communauté."
                />
              </Reveal>
              <Reveal delay={0.12} className="mt-12 hidden lg:block">
                <ArchImage
                  src={src(PHOTOS.galerie5)}
                  alt={PHOTOS.galerie5.alt}
                  className="aspect-[3/4] w-64"
                  sizes="18rem"
                />
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ol className="border-t hairline">
              {activities.map((activity, index) => (
                <li key={activity.slug} className="zellige-hover border-b hairline">
                  <Reveal delay={index * 0.04}>
                    <Link
                      href={`/activites/${activity.slug}`}
                      className="group grid gap-x-8 gap-y-3 py-9 sm:grid-cols-12 sm:items-baseline lg:py-11"
                    >
                      <span
                        aria-hidden
                        className="font-display text-xl italic text-charcoal/30 transition-colors duration-300 group-hover:text-charcoal sm:col-span-1"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="sm:col-span-7">
                        <span className="block font-display text-3xl leading-tight font-medium text-charcoal transition-transform duration-500 [transition-timing-function:var(--ease-out-soft)] group-hover:translate-x-2 motion-reduce:transition-none sm:text-4xl">
                          {activity.title}
                        </span>
                        <span className="mt-3 block max-w-lg text-[0.92rem] leading-[1.75] text-charcoal/65">
                          {activity.summary}
                        </span>
                      </span>
                      <span className="flex items-center justify-between gap-4 sm:col-span-4 sm:flex-col sm:items-end">
                        <span className="text-[0.66rem] font-semibold tracking-[0.22em] text-taupe uppercase">
                          {activity.audience}
                        </span>
                        <span
                          aria-hidden
                          className="text-taupe transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-charcoal motion-reduce:transition-none"
                        >
                          →
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
