import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES } from "@/content/services";

/**
 * 08 — SERVICES & INFORMATIONS PRATIQUES. Liste typographique éditoriale,
 * marqueurs losange — aucune iconographie décorative.
 */
export function ServicesSection({ number = "08" }: { number?: string }) {
  return (
    <section
      aria-labelledby="services-titre"
      className="bg-ivory py-24 lg:py-36"
    >
      <Container>
        <Reveal>
          <SectionHeading
            number={number}
            eyebrow="Services & informations pratiques"
            title={
              <span id="services-titre">
                Au service
                <br />
                <em className="font-light italic">des fidèles</em>
              </span>
            }
          />
        </Reveal>

        <dl className="mt-14 grid gap-x-12 gap-y-0 border-t hairline sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.label} delay={(index % 3) * 0.05}>
              <div className="flex h-full flex-col gap-2 border-b hairline py-7 pr-4">
                <dt className="flex items-center gap-3 font-display text-[1.45rem] leading-tight font-medium text-charcoal">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rotate-45 bg-beige"
                  />
                  {service.label}
                </dt>
                <dd className="pl-[1.15rem] text-[0.88rem] leading-relaxed text-charcoal/60">
                  {service.note}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl text-[0.85rem] leading-relaxed text-taupe">
            Pour la prière funéraire (Salat Janaza) ou toute demande
            particulière, contactez directement la mosquée — l’équipe vous
            accompagnera.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
