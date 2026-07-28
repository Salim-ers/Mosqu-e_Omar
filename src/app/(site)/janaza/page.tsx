import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getJanaza, getSettings } from "@/lib/content";
import { formatJanazaDate } from "@/lib/dates";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Prières funéraires",
  description:
    "Les prières funéraires (Salat Janaza) annoncées par la mosquée Omar Ibn al Khattab de Creil.",
  alternates: { canonical: "/janaza" },
};

export default async function JanazaPage() {
  const [janaza, settings] = await Promise.all([getJanaza(), getSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Salat Janaza"
        title={
          <>
            Prières
            <br />
            <em className="font-light italic">funéraires</em>
          </>
        }
        lead="Les prières funéraires annoncées par la mosquée. Pour organiser une janaza, contactez directement l’équipe — elle vous accompagnera dans les démarches."
      >
        <p
          className="mt-8 font-arabic text-xl text-ivory/60"
          lang="ar"
          dir="rtl"
        >
          إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
        </p>
      </PageHeader>

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          {janaza.length === 0 ? (
            <Reveal>
              <p className="max-w-2xl text-[1rem] leading-[1.85] text-charcoal/70">
                Aucune prière funéraire n’est annoncée à ce jour. Les annonces
                sont publiées ici dès que la mosquée en est informée, et
                retirées quelques jours après la prière.
              </p>
            </Reveal>
          ) : (
            <ul className="border-t hairline">
              {janaza.map((entry, index) => (
                <li key={entry.id} className="border-b hairline">
                  <Reveal delay={index * 0.05}>
                    <div className="grid gap-4 py-9 sm:grid-cols-12 sm:gap-8">
                      <p className="text-[0.74rem] font-semibold tracking-[0.2em] text-taupe uppercase sm:col-span-4">
                        {formatJanazaDate(entry.prayerAt)}
                      </p>
                      <div className="sm:col-span-8">
                        <h2 className="font-display text-3xl leading-snug font-medium text-charcoal">
                          {entry.name}
                        </h2>
                        <p className="mt-3 text-[0.95rem] leading-relaxed text-charcoal/70">
                          {entry.place}
                        </p>
                        {entry.burialPlace ? (
                          <p className="mt-1 text-[0.95rem] leading-relaxed text-charcoal/70">
                            Inhumation : {entry.burialPlace}
                          </p>
                        ) : null}
                        {entry.note ? (
                          <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-charcoal/55">
                            {entry.note}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}

          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-wrap gap-4">
              <ButtonLink href={settings.phoneHref} external>
                {settings.phone}
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Contacter la mosquée
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
