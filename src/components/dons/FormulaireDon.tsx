import { ButtonLink } from "@/components/ui/Button";

/**
 * ============================================================================
 * FORMULAIRE DE DON INTÉGRÉ À LA PAGE
 * ----------------------------------------------------------------------------
 * Le paiement n'est pas encaissé par ce site : il l'est par la plateforme de
 * l'association, seule habilitée à manipuler des numéros de carte et à émettre
 * les reçus fiscaux. Ce qui change ici, c'est que le donateur ne quitte plus la
 * mosquée pour aller donner ailleurs — le formulaire s'ouvre dans la page.
 *
 * Le bénévole colle simplement l'adresse de sa campagne dans Réglages ; si
 * c'est un formulaire HelloAsso, il est intégré, sinon un bouton mène à la
 * plateforme. Rien à reconfigurer le jour où l'association change d'outil.
 * ============================================================================
 */

/**
 * Adresse intégrable d'un formulaire HelloAsso.
 *
 * HelloAsso publie chaque campagne à deux adresses : la page publique
 * `…/associations/<asso>/formulaires/<n>` et le même formulaire intégrable en
 * ajoutant `/widget`. Le bénévole colle l'une ou l'autre, sans y penser.
 *
 * Renvoie `null` pour tout le reste — page d'association, autre plateforme —
 * auquel cas un bouton prend le relais : mieux vaut un lien franc qu'un cadre
 * vide.
 */
export function adresseIntegrable(url: string): string | null {
  const propre = url.trim().split(/[?#]/)[0].replace(/\/+$/, "");
  if (!/^https:\/\/(www\.)?helloasso\.com\/.+\/formulaires\/[^/]+/i.test(propre))
    return null;
  return propre.endsWith("/widget") ? propre : `${propre}/widget`;
}

export function FormulaireDon({
  url,
  titre,
  libelleBouton,
}: {
  url: string;
  titre: string;
  libelleBouton: string;
}) {
  const integrable = adresseIntegrable(url);

  if (!integrable) {
    return (
      <div className="border hairline bg-cream p-8 text-center sm:p-12">
        <p className="mx-auto max-w-md text-[0.95rem] leading-[1.8] text-charcoal/70">
          Le don se fait sur la plateforme sécurisée de l’association. Vous y
          recevrez votre reçu fiscal.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href={url} external>
            {libelleBouton}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden border hairline bg-cream">
        <iframe
          src={integrable}
          title={titre}
          loading="lazy"
          allow="payment"
          className="block h-[46rem] w-full border-0 sm:h-[52rem]"
        />
      </div>
      <p className="mt-4 text-center text-[0.82rem] leading-relaxed text-taupe">
        Le formulaire ne s’affiche pas ?{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-charcoal"
        >
          Ouvrir la page de don dans un nouvel onglet
        </a>
        .
      </p>
    </div>
  );
}
