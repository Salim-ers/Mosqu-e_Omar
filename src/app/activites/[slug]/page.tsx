import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { ArchImage } from "@/components/ui/ArchImage";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { REGISTRATIONS, REGISTRATION_LABELS } from "@/config/registrations";
import { site } from "@/config/site";
import { ACTIVITIES, getActivity } from "@/content/activities";
import { PHOTOS } from "@/lib/media";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ACTIVITIES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivity(slug);
  if (!activity) return { title: "Activité introuvable" };
  return {
    title: activity.title,
    description: activity.summary,
    alternates: { canonical: `/activites/${activity.slug}` },
  };
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const activity = getActivity(slug);
  if (!activity) notFound();

  const registration = activity.registrationKey
    ? REGISTRATIONS[activity.registrationKey]
    : null;
  const registrationLabel = registration
    ? REGISTRATION_LABELS[registration.status]
    : null;

  return (
    <>
      <PageHeader
        eyebrow={activity.kicker}
        title={activity.title}
        lead={activity.summary}
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="font-display text-3xl font-medium text-charcoal sm:text-4xl">
                  Au programme
                </h2>
                <ul className="mt-8 border-t hairline">
                  {activity.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-4 border-b hairline py-5 text-[0.98rem] leading-[1.75] text-charcoal/75"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rotate-45 bg-amber"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 max-w-xl text-[0.98rem] leading-[1.85] text-charcoal/72">
                  {activity.detail}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-12 border hairline bg-cream p-7 sm:p-9">
                  <p className="text-[0.66rem] font-semibold tracking-[0.28em] text-taupe uppercase">
                    Public concerné
                  </p>
                  <p className="mt-3 font-display text-2xl font-medium text-charcoal">
                    {activity.audience}
                  </p>

                  {registration && registrationLabel ? (
                    <div className="mt-6 border-t border-charcoal/12 pt-6">
                      <p
                        className={`flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.24em] uppercase ${registrationLabel.toneClass}`}
                      >
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rotate-45 bg-current"
                        />
                        {registrationLabel.label}
                      </p>
                      {registration.note ? (
                        <p className="mt-3 text-[0.9rem] leading-relaxed text-charcoal/65">
                          {registration.note}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-7 flex flex-wrap gap-4">
                    <ButtonLink href="/inscriptions">
                      Inscriptions & renseignements
                    </ButtonLink>
                    <ButtonLink
                      href={site.contact.phoneHref}
                      external
                      variant="outline"
                    >
                      {site.contact.phone}
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            </div>

            <aside className="lg:col-span-5">
              <Reveal delay={0.08}>
                <ArchImage
                  photo={PHOTOS[activity.photo]}
                  className="mx-auto aspect-[3/4] w-full max-w-md lg:sticky lg:top-32"
                  sizes="(min-width: 1024px) 36vw, 88vw"
                />
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
