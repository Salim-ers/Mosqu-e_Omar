import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site de la ${site.longName}, édité par l’association ${site.association.acronym}.`,
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

/**
 * TODO (validation humaine) : confirmer le nom du directeur de publication
 * (président de l'association) et les coordonnées exactes de l'hébergeur
 * avant la mise en ligne.
 */
export const revalidate = 3600;

export default async function MentionsLegalesPage() {
  const settings = await getSettings();
  const adresse = `${settings.address.street}, ${settings.address.postalCode} ${settings.address.city}`;

  return (
    <>
      <PageHeader eyebrow="Informations légales" title="Mentions légales" />
      <section className="bg-ivory py-14 lg:py-20">
        <Container>
          <Reveal>
            <div className="wp-prose max-w-3xl">
              <h2>Éditeur du site</h2>
              <p>
                Le site {site.url.replace("https://", "")} est édité par
                l’association <strong>{site.association.acronym}</strong> —{" "}
                {site.association.description}, association régie par la loi du
                1<sup>er</sup> juillet 1901.
              </p>
              <ul>
                <li>Siège : {adresse}</li>
                <li>SIRET : {site.association.siret}</li>
                <li>Téléphone : {settings.phone}</li>
                <li>Email : {settings.email}</li>
              </ul>
              <p>
                Directeur de la publication : le président de l’association{" "}
                {site.association.acronym} (nom communicable sur demande auprès
                de l’association).
              </p>

              <h2>Hébergement</h2>
              <p>
                Le site est hébergé par <strong>Vercel Inc.</strong>, 440 N
                Barranca Ave #4133, Covina, CA 91723, États-Unis —
                vercel.com. Les contenus éditoriaux sont gérés via un espace
                WordPress opéré par l’association.
              </p>

              <h2>Propriété intellectuelle</h2>
              <p>
                L’ensemble des contenus du site (textes, photographies, logo,
                identité visuelle) appartient à l’association{" "}
                {site.association.acronym} ou fait l’objet d’une autorisation
                d’utilisation. Toute reproduction sans accord préalable est
                interdite.
              </p>

              <h2>Horaires de prière</h2>
              <p>
                Les horaires de prière affichés proviennent du service MAWAQIT
                (mawaqit.net), sur lequel la mosquée publie ses horaires
                officiels. En cas de divergence, les horaires annoncés à la
                mosquée font foi.
              </p>

              <h2>Liens externes</h2>
              <p>
                Le site contient des liens vers des services tiers (MAWAQIT,
                formulaires de don, cartographie). L’association n’est pas
                responsable du contenu de ces services.
              </p>

              <h2>Nous signaler un problème</h2>
              <p>
                Pour toute question relative au site ou pour signaler une
                erreur : {settings.email}.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
