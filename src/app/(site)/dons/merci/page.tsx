import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Merci pour votre don",
  // Une page d'issue de paiement n'a rien à faire dans un moteur de
  // recherche : on n'y arrive que depuis son propre paiement.
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default async function MerciPage() {
  const reglages = await getSettings();

  return (
    <section className="on-dark relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-ink py-28 text-ivory lg:py-36">
      <div aria-hidden className="pattern-zellige absolute inset-0" />
      <Container className="relative">
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <Eyebrow onDark className="justify-center">
              Barak Allahou fik
            </Eyebrow>
            <h1 className="mt-7 font-display text-[3rem] leading-[1] font-medium tracking-[-0.02em] sm:text-6xl lg:text-7xl">
              Votre don
              <br />
              <em className="font-light italic">est bien reçu</em>
            </h1>
            <p className="mt-8 text-[1.02rem] leading-[1.85] text-ivory/90">
              Qu’Allah récompense votre générosité. Un justificatif vous a été
              envoyé par courriel. Pour un reçu fiscal, écrivez à l’association
              à{" "}
              <a
                href={`mailto:${reglages.email}`}
                className="underline underline-offset-4 hover:text-ivory"
              >
                {reglages.email}
              </a>
              .
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/" variant="inverse">
                Retour à l’accueil
              </ButtonLink>
              <ButtonLink href="/horaires" variant="onDark">
                Horaires de prière
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
