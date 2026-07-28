import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** En-tête éditorial des pages intérieures : très grand titre, filet, air. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b hairline bg-ivory pt-36 pb-16 lg:pt-44 lg:pb-20">
      <Container>
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-7 max-w-4xl font-display text-[3rem] leading-[1.02] font-medium tracking-[-0.015em] text-charcoal sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-7 max-w-2xl text-[1.02rem] leading-[1.85] text-charcoal/70">
              {lead}
            </p>
          ) : null}
          {children}
        </Reveal>
      </Container>
    </header>
  );
}
