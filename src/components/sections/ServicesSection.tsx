import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServices } from "@/lib/content";

/**
 * 08 — SERVICES & INFORMATIONS PRATIQUES. Liste typographique éditoriale,
 * marqueurs losange — aucune iconographie décorative.
 */
export async function ServicesSection({ number = "08" }: { number?: string }) {
  const services = await getServices();

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
          {services.map((service, index) => (
            <Reveal key={service.label} delay={(index % 3) * 0.05}>
              <div className="flex h-full flex-col gap-2 border-b hairline py-7 pr-4">
                <dt className="flex items-center gap-3 font-display text-[1.45rem] leading-tight font-medium text-charcoal">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rotate-45 bg-charcoal"
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
          <div className="on-dark relative mt-12 overflow-hidden rounded-[2px] bg-ink px-7 py-8 text-ivory sm:px-10 sm:py-9">
            <div aria-hidden className="pattern-khatam-light absolute inset-0" />
            <p className="relative flex items-center gap-3 text-[0.62rem] font-semibold tracking-[0.28em] text-ivory/55 uppercase">
              <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-amber" />
              Une demande particulière
            </p>
            <p className="relative mt-4 max-w-2xl text-[0.95rem] leading-[1.8] text-ivory/80">
              Pour la prière funéraire (Salat Janaza) ou toute autre demande,
              contactez directement la mosquée — l’équipe vous accompagnera.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
