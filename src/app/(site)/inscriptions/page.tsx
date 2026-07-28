import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { REGISTRATION_LABELS } from "@/config/registrations";
import { getInscriptions, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Inscriptions",
  description:
    "Inscriptions aux cours de Coran, de langue arabe et au soutien scolaire de la mosquée Omar Ibn al Khattab de Creil.",
  alternates: { canonical: "/inscriptions" },
};

export const revalidate = 3600;

export default async function InscriptionsPage() {
  const [entries, settings] = await Promise.all([
    getInscriptions(),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Inscriptions"
        title={
          <>
            Rejoindre
            <br />
            <em className="font-light italic">les cours</em>
          </>
        }
        lead="Les inscriptions se font directement auprès de la mosquée — par téléphone, par email ou sur place. L’équipe vous orientera selon l’âge et le niveau."
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <ul className="border-t hairline">
            {entries.map((entry, index) => {
              const status = REGISTRATION_LABELS[entry.status];
              return (
                <li key={entry.label} className="zellige-hover border-b hairline">
                  <Reveal delay={index * 0.05}>
                    <div className="grid gap-3 py-9 sm:grid-cols-12 sm:items-baseline sm:gap-8">
                      <span
                        aria-hidden
                        className="font-display text-xl italic text-charcoal/30 sm:col-span-1"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-display text-3xl leading-tight font-medium text-charcoal sm:col-span-4">
                        {entry.label}
                      </h2>
                      <div className="sm:col-span-7">
                        <p
                          className={`flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.24em] uppercase ${status.toneClass}`}
                        >
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 rotate-45 bg-current"
                          />
                          {status.label}
                        </p>
                        {entry.note ? (
                          <p className="mt-3 max-w-lg text-[0.92rem] leading-[1.8] text-charcoal/68">
                            {entry.note}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          <Reveal delay={0.12}>
            <div className="mt-16 border hairline bg-cream p-8 sm:p-12">
              <h2 className="font-display text-3xl font-medium text-charcoal sm:text-4xl">
                Comment s’inscrire
              </h2>
              <p className="mt-4 max-w-2xl text-[0.95rem] leading-[1.85] text-charcoal/70">
                Contactez la mosquée pour connaître les créneaux, les niveaux
                et les modalités de la session en cours — ou présentez-vous
                directement à l’accueil après une prière.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href={settings.phoneHref} external>
                  {settings.phone}
                </ButtonLink>
                <ButtonLink
                  href={`mailto:${settings.email}`}
                  external
                  variant="outline"
                >
                  Écrire à la mosquée
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline">
                  Venir sur place
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
