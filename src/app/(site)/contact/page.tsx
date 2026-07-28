import type { Metadata } from "next";

import { MapEmbed } from "@/components/location/MapEmbed";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
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

export default async function ContactPage() {
  const settings = await getSettings();

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
                      {site.address.street}
                      <br />
                      {site.address.postalCode} {site.address.city}
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
                <MapEmbed className="h-[380px] sm:h-[480px] lg:h-full lg:min-h-[560px]" />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
