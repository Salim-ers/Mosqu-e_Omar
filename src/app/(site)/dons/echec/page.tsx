import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Le don n’a pas abouti",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default async function EchecPage() {
  const reglages = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Soutenir la mosquée"
        title={
          <>
            Le paiement
            <br />
            <em className="font-light italic">n’a pas abouti</em>
          </>
        }
        lead="Rien n’a été prélevé. Cela arrive : un montant mal saisi, une carte refusée, une connexion interrompue."
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <p className="text-[0.98rem] leading-[1.85] text-charcoal/70">
                Vous pouvez reprendre votre don, ou passer par un autre moyen :
                un virement, ou un don en main propre à la mosquée. Si le
                problème persiste, écrivez à l’association à{" "}
                <a
                  href={`mailto:${reglages.email}`}
                  className="underline underline-offset-4 hover:text-charcoal"
                >
                  {reglages.email}
                </a>{" "}
                ou appelez le {reglages.phone} : quelqu’un vous répondra.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href="/dons">Reprendre mon don</ButtonLink>
                <ButtonLink href="/contact" variant="outline">
                  Contacter la mosquée
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
