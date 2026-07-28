import type { Metadata } from "next";

import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { GALLERY } from "@/lib/media";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "La mosquée Omar Ibn al Khattab de Creil en images : le chantier, la construction et le lieu aujourd’hui.",
  alternates: { canonical: "/galerie" },
};

export default function GaleriePage() {
  return (
    <>
      <PageHeader
        eyebrow="Galerie"
        title={
          <>
            La mosquée
            <br />
            <em className="font-light italic">en images</em>
          </>
        }
        lead="Du chantier aux premières prières : les photographies publiées par la mosquée retracent le chemin parcouru par la communauté."
      />
      <section className="bg-ivory py-16 lg:py-24">
        <Container>
          <Reveal>
            <GalleryGrid photos={GALLERY} />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
