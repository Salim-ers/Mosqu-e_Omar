import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ArchImage } from "@/components/ui/ArchImage";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ACTIVITIES } from "@/content/activities";
import { PHOTOS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Activités",
  description:
    "Cours de Coran, dourous, cours de langue arabe, soutien scolaire et vie communautaire à la mosquée Omar Ibn al Khattab de Creil.",
  alternates: { canonical: "/activites" },
};

export default function ActivitesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Activités"
        title={
          <>
            Apprendre, transmettre,
            <br />
            <em className="font-light italic">se retrouver</em>
          </>
        }
        lead="Tout au long de l’année, la mosquée propose des activités religieuses, éducatives et sociales, ouvertes à toutes les générations."
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <div className="space-y-20 lg:space-y-28">
            {ACTIVITIES.map((activity, index) => (
              <Reveal key={activity.slug}>
                <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                  <div
                    className={
                      index % 2 === 0
                        ? "lg:col-span-5"
                        : "lg:order-2 lg:col-span-5"
                    }
                  >
                    <ArchImage
                      photo={PHOTOS[activity.photo]}
                      className="mx-auto aspect-[3/4] w-full max-w-sm"
                      sizes="(min-width: 1024px) 32vw, 80vw"
                    />
                  </div>
                  <div
                    className={
                      index % 2 === 0
                        ? "lg:col-span-7"
                        : "lg:order-1 lg:col-span-7"
                    }
                  >
                    <p className="flex items-center gap-4 text-[0.66rem] font-semibold tracking-[0.28em] text-taupe uppercase">
                      <span
                        aria-hidden
                        className="font-display text-sm italic tracking-normal text-beige"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden className="h-px w-10 bg-beige" />
                      {activity.kicker}
                    </p>
                    <h2 className="mt-5 font-display text-4xl leading-[1.05] font-medium text-charcoal sm:text-5xl">
                      {activity.title}
                    </h2>
                    <p className="mt-5 max-w-xl text-[0.98rem] leading-[1.85] text-charcoal/72">
                      {activity.summary}
                    </p>
                    <p className="mt-4 text-[0.72rem] font-semibold tracking-[0.22em] text-taupe uppercase">
                      {activity.audience}
                    </p>
                    <Link
                      href={`/activites/${activity.slug}`}
                      className="link-editorial mt-7 inline-block text-[0.74rem] font-semibold tracking-[0.2em] text-charcoal uppercase"
                    >
                      Découvrir cette activité →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
