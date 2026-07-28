import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-ivory pt-28 pb-20">
      <Container className="text-center">
        <p className="font-display text-8xl font-light italic text-beige sm:text-9xl">
          404
        </p>
        <h1 className="mt-6 font-display text-4xl font-medium text-charcoal sm:text-5xl">
          Cette page n’existe pas
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-[1.8] text-charcoal/65">
          La page demandée a peut-être été déplacée. Retrouvez l’essentiel
          depuis l’accueil, ou consultez directement les horaires de prière.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Retour à l’accueil</ButtonLink>
          <ButtonLink href="/horaires" variant="outline">
            Horaires de prière
          </ButtonLink>
        </div>
        <p className="mt-8">
          <Link
            href="/contact"
            className="link-editorial text-[0.72rem] font-semibold tracking-[0.2em] text-charcoal/60 uppercase"
          >
            Signaler un lien cassé
          </Link>
        </p>
      </Container>
    </section>
  );
}
