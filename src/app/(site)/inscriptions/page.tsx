import type { Metadata } from "next";

import { InscriptionForm } from "@/components/inscriptions/InscriptionForm";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
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

export default async function InscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const [entries, settings, { ok, erreur }] = await Promise.all([
    getInscriptions(),
    getSettings(),
    searchParams,
  ]);
  const ouverts = entries
    .filter((entry) => entry.status === "OPEN")
    .map((entry) => entry.label);

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
                Par téléphone ou sur place
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

      {ouverts.length > 0 ? (
        <section
          aria-labelledby="formulaire-titre"
          className="border-t hairline bg-cream py-16 lg:py-24"
        >
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <Reveal>
                  <Eyebrow number="02">S’inscrire en ligne</Eyebrow>
                  <h2
                    id="formulaire-titre"
                    className="mt-6 font-display text-4xl leading-tight font-medium text-charcoal sm:text-5xl"
                  >
                    Demander
                    <br />
                    <em className="font-light italic">une place</em>
                  </h2>
                  <p className="mt-5 max-w-md text-[0.98rem] leading-[1.85] text-charcoal/70">
                    Remplissez ce formulaire et un bénévole vous rappellera pour
                    confirmer l’inscription et vous indiquer les créneaux.
                  </p>
                </Reveal>
              </div>

              <div className="lg:col-span-8">
                <Reveal delay={0.08}>
                  {ok ? (
                    <div className="border hairline bg-ivory p-8 sm:p-10">
                      <p className="font-display text-3xl font-medium text-charcoal">
                        Votre demande est enregistrée.
                      </p>
                      <p className="mt-4 max-w-xl text-[0.98rem] leading-[1.85] text-charcoal/70">
                        Un bénévole de la mosquée vous recontactera pour
                        confirmer la place. Qu’Allah vous récompense.
                      </p>
                    </div>
                  ) : (
                    <>
                      {erreur ? (
                        <p
                          role="alert"
                          className="mb-6 rounded-[2px] border border-[#8a2a20]/25 bg-[#8a2a20]/6 px-4 py-3 text-[0.9rem] text-[#8a2a20]"
                        >
                          {erreur}
                        </p>
                      ) : null}
                      <InscriptionForm cours={ouverts} />
                    </>
                  )}
                </Reveal>
              </div>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
