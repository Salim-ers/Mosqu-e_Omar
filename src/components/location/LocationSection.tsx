import { MapEmbed } from "@/components/location/MapEmbed";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";

/**
 * 10 — NOUS TROUVER. Adresse, contact et itinéraire ; la carte n'est chargée
 * qu'à la demande.
 */
export function LocationSection({ number = "10" }: { number?: string }) {
  return (
    <section
      aria-labelledby="localisation-titre"
      className="bg-ivory py-24 lg:py-36"
    >
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                number={number}
                eyebrow="Nous trouver"
                title={
                  <span id="localisation-titre">
                    Au cœur
                    <br />
                    <em className="font-light italic">de Creil</em>
                  </span>
                }
              />
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-10 space-y-7 border-t hairline pt-8">
                <div className="grid gap-1 sm:grid-cols-12 sm:gap-6">
                  <dt className="text-[0.66rem] font-semibold tracking-[0.26em] text-taupe uppercase sm:col-span-4 sm:pt-1">
                    Adresse
                  </dt>
                  <dd className="font-display text-2xl leading-snug font-medium text-charcoal sm:col-span-8">
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city}
                  </dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-12 sm:gap-6">
                  <dt className="text-[0.66rem] font-semibold tracking-[0.26em] text-taupe uppercase sm:col-span-4 sm:pt-1">
                    Téléphone
                  </dt>
                  <dd className="sm:col-span-8">
                    <a
                      href={site.contact.phoneHref}
                      className="link-editorial font-display text-2xl font-medium text-charcoal"
                    >
                      {site.contact.phone}
                    </a>
                  </dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-12 sm:gap-6">
                  <dt className="text-[0.66rem] font-semibold tracking-[0.26em] text-taupe uppercase sm:col-span-4 sm:pt-1">
                    Email
                  </dt>
                  <dd className="sm:col-span-8">
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="link-editorial text-lg break-all text-charcoal"
                    >
                      {site.contact.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href={site.map.directionsUrl} external>
                  Itinéraire
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline">
                  Nous contacter
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <MapEmbed className="h-[380px] sm:h-[460px] lg:h-[540px]" />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
