import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * En-tête éditorial des pages intérieures : bloc d'encre profond prolongeant
 * le bandeau de navigation, très grand titre en Cormorant, filigrane khatam.
 * Le contraste avec le corps ivoire donne au site son rythme clair/sombre.
 */
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
    <header className="on-dark relative overflow-hidden bg-ink pt-36 pb-16 text-ivory lg:pt-44 lg:pb-20">
      <div aria-hidden className="pattern-zellige absolute inset-0" />
      {/* Voile chaud très discret — évite le noir plat. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-transparent to-transparent"
      />
      <Container className="relative">
        <Reveal>
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h1 className="mt-7 max-w-4xl font-display text-[3rem] leading-[1.02] font-medium tracking-[-0.015em] text-ivory sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-7 max-w-2xl text-[1.02rem] leading-[1.85] text-ivory/70">
              {lead}
            </p>
          ) : null}
          {children}
        </Reveal>
      </Container>
    </header>
  );
}
