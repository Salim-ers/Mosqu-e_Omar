import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Politique de confidentialité du site de la ${site.longName} : données collectées, services tiers et droits des visiteurs.`,
  alternates: { canonical: "/politique-confidentialite" },
  robots: { index: false, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHeader
        eyebrow="Informations légales"
        title={
          <>
            Politique de
            <br />
            <em className="font-light italic">confidentialité</em>
          </>
        }
      />
      <section className="bg-ivory py-14 lg:py-20">
        <Container>
          <Reveal>
            <div className="wp-prose max-w-3xl">
              <h2>Une approche sobre des données</h2>
              <p>
                Ce site est un site d’information : il ne comporte ni compte
                utilisateur, ni formulaire de collecte de données, ni outil de
                mesure d’audience publicitaire, et ne dépose pas de cookies de
                suivi de sa propre initiative.
              </p>

              <h2>Données que vous nous transmettez</h2>
              <p>
                Lorsque vous contactez la mosquée par téléphone (
                {site.contact.phone}) ou par email ({site.contact.email}), les
                informations transmises ne sont utilisées que pour répondre à
                votre demande (renseignements, inscriptions, reçus fiscaux).
                Elles ne sont ni cédées, ni vendues.
              </p>

              <h2>Services tiers intégrés</h2>
              <ul>
                <li>
                  <strong>MAWAQIT</strong> (mawaqit.net) — affichage des
                  horaires de prière officiels de la mosquée. Le widget est
                  chargé depuis les serveurs de MAWAQIT.
                </li>
                <li>
                  <strong>Google Maps</strong> — le plan d’accès n’est chargé
                  qu’après votre clic sur « Afficher la carte » : aucune
                  requête n’est envoyée à Google avant votre action.
                </li>
                <li>
                  <strong>Formulaires de don</strong> — les dons en ligne sont
                  traités sur les pages sécurisées de l’association ; les
                  éventuelles données de paiement y sont gérées par le
                  prestataire de paiement, jamais par ce site.
                </li>
              </ul>
              <p>
                Chacun de ces services applique sa propre politique de
                confidentialité, que nous vous invitons à consulter.
              </p>

              <h2>Hébergement et journaux techniques</h2>
              <p>
                L’hébergeur du site (Vercel) peut conserver des journaux
                techniques (adresse IP, pages consultées) à des fins de
                sécurité et de bon fonctionnement, pour une durée limitée.
              </p>

              <h2>Vos droits</h2>
              <p>
                Conformément au Règlement général sur la protection des données
                (RGPD) et à la loi Informatique et Libertés, vous disposez d’un
                droit d’accès, de rectification et d’effacement des données
                vous concernant. Pour l’exercer, écrivez à :{" "}
                {site.contact.email}. Vous pouvez également saisir la CNIL
                (cnil.fr) si vous estimez que vos droits ne sont pas respectés.
              </p>

              <h2>Mise à jour</h2>
              <p>
                Cette politique pourra être mise à jour pour refléter
                l’évolution du site. Dernière révision : juillet 2026.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
