import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/location/MapEmbed";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacter la mosquée Omar Ibn al Khattab de Creil : adresse, téléphone, email et plan d’accès.",
  alternates: { canonical: "/contact" },
};

export const revalidate = 3600;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const [settings, { ok, erreur }] = await Promise.all([
    getSettings(),
    searchParams,
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Venir, appeler,
            <br />
            <em className="font-light italic">écrire</em>
          </>
        }
        lead="L’équipe de la mosquée répond à vos questions sur les horaires, les inscriptions, les dons et la vie de l’association."
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <dl className="space-y-9 border-t hairline pt-9">
                  <div>
                    <dt className="text-[0.66rem] font-semibold tracking-[0.26em] text-taupe uppercase">
                      Adresse
                    </dt>
                    <dd className="mt-3 font-display text-3xl leading-snug font-medium text-charcoal">
                      {settings.address.street}
                      <br />
                      {settings.address.postalCode} {settings.address.city}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.66rem] font-semibold tracking-[0.26em] text-taupe uppercase">
                      Téléphone
                    </dt>
                    <dd className="mt-3">
                      <a
                        href={settings.phoneHref}
                        className="link-editorial font-display text-3xl font-medium text-charcoal"
                      >
                        {settings.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.66rem] font-semibold tracking-[0.26em] text-taupe uppercase">
                      Email
                    </dt>
                    <dd className="mt-3">
                      <a
                        href={`mailto:${settings.email}`}
                        className="link-editorial font-display text-2xl break-all font-medium text-charcoal sm:text-3xl"
                      >
                        {settings.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-11 flex flex-wrap gap-4">
                  <ButtonLink href={site.map.directionsUrl} external>
                    Itinéraire
                  </ButtonLink>
                  <ButtonLink
                    href={site.mawaqit.pageUrl}
                    external
                    variant="outline"
                  >
                    Horaires sur MAWAQIT
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-11 max-w-md border-t hairline pt-7 text-[0.88rem] leading-[1.8] text-charcoal/60">
                  Le meilleur moment pour rencontrer l’équipe : après les
                  prières, directement à la mosquée. Pour la Salat Janaza et
                  les demandes urgentes, privilégiez le téléphone.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.06}>
                <MapEmbed className="h-[380px] sm:h-[480px] lg:h-[560px]" />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="ecrire-titre"
        className="border-t hairline bg-cream py-16 lg:py-24"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow number="02">Écrire à la mosquée</Eyebrow>
                <h2
                  id="ecrire-titre"
                  className="mt-6 font-display text-4xl leading-tight font-medium text-charcoal sm:text-5xl"
                >
                  Une question&nbsp;?
                </h2>
                <p className="mt-5 max-w-md text-[0.98rem] leading-[1.85] text-charcoal/70">
                  Inscriptions, dons, prière funéraire, visite de la mosquée :
                  écrivez-nous, un bénévole vous répondra.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal delay={0.08}>
                {ok ? (
                  <div className="border hairline bg-ivory p-8 sm:p-10">
                    <p className="font-display text-3xl font-medium text-charcoal">
                      Votre message est bien arrivé.
                    </p>
                    <p className="mt-4 max-w-xl text-[0.98rem] leading-[1.85] text-charcoal/70">
                      L’équipe de la mosquée en prend connaissance et vous
                      répondra dès que possible. Qu’Allah vous récompense.
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
                    <ContactForm />
                  </>
                )}
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
