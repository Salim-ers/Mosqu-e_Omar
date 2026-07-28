"use client";

import { useEffect } from "react";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70svh] items-center bg-ivory pt-28 pb-20">
      <Container className="text-center">
        <p className="text-[0.7rem] font-semibold tracking-[0.3em] text-taupe uppercase">
          Erreur inattendue
        </p>
        <h1 className="mt-5 font-display text-4xl font-medium text-charcoal sm:text-5xl">
          Un incident est survenu
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-[1.8] text-charcoal/65">
          Nos excuses pour la gêne. Vous pouvez réessayer — si le problème
          persiste, les horaires restent disponibles sur MAWAQIT.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button onClick={reset}>Réessayer</Button>
          <ButtonLink href="/" variant="outline">
            Retour à l’accueil
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
