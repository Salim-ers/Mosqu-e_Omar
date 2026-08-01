import { ButtonLink } from "@/components/ui/Button";

/**
 * ============================================================================
 * FORMULAIRE DE DON INTÉGRÉ À LA PAGE
 * ----------------------------------------------------------------------------
 * L'association encaisse déjà les dons, avec ses propres formulaires et son
 * propre compte Stripe. Personne ici n'a la main dessus — et il n'y en a pas
 * besoin : ces formulaires sont conçus pour être intégrés ailleurs, et c'est
 * exactement ce que fait l'ancien site lui-même.
 *
 * Le donateur reste donc sur les pages de la mosquée, dans sa mise en page,
 * avec ses textes. Seul le formulaire, dans son cadre, vient d'ailleurs.
 *
 * Tant que ce cadre dépend de l'ancien site, il vit et meurt avec lui : le
 * jour où le domaine basculera, il faudra soit garder ce site sur un
 * sous-domaine, soit disposer du compte Stripe. Le repli ci-dessous fait que
 * ce jour-là, personne ne tombera sur un cadre vide.
 * ============================================================================
 */

/**
 * Le formulaire de don de l'ancien site, dans sa version autonome — sans
 * en-tête ni pied de page, faite pour l'intégration. C'est l'adresse que la
 * page « Projet » du WordPress emploie déjà pour son propre cadre.
 */
const FORMULAIRE_ANCIEN_SITE =
  "https://mosqueeomarcreil.fr/?givewp-route=donation-form-view&form-id=925";

/**
 * Adresse intégrable correspondant à une adresse de don.
 *
 * Seules deux origines sont intégrées : celle de l'association et HelloAsso.
 * Toute autre adresse — une plateforme qui refuserait d'être encadrée, un lien
 * de paiement Stripe — reçoit un bouton franc plutôt qu'un cadre resté blanc.
 */
export function adresseIntegrable(url: string): string | null {
  // L'adresse est comparée sans sa barre oblique finale, mais transmise telle
  // qu'elle a été saisie : sur ces serveurs, « /abonnement » redirige vers
  // « /abonnement/ », et un aller-retour de plus retarde le formulaire.
  const exacte = url.trim().split("#")[0];
  const propre = exacte.replace(/\/+$/, "");

  // La page « Projet » du WordPress n'est pas le formulaire : elle l'encadre.
  // On va chercher le formulaire lui-même, sans le décor de l'ancien site.
  if (/^https:\/\/(www\.)?mosqueeomarcreil\.fr\/projet(\/|$|\?)/i.test(propre))
    return FORMULAIRE_ANCIEN_SITE;

  // Les autres pages de l'association sont déjà des pages de formulaire.
  if (/^https:\/\/(www\.)?mosqueeomarcreil\.fr\//i.test(propre)) return exacte;

  // HelloAsso publie chaque campagne en version intégrable sous « /widget ».
  if (/^https:\/\/(www\.)?helloasso\.com\/.+\/formulaires\/[^/]+/i.test(propre))
    return propre.endsWith("/widget") ? propre : `${propre}/widget`;

  return null;
}

export function CadreDon({
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
      <div className="border hairline bg-cream p-8 sm:p-10">
        <p className="max-w-md text-[1.02rem] leading-[1.85] text-charcoal/75">
          Vous choisissez votre montant sur la page de paiement sécurisée de
          l’association.
        </p>
        <div className="mt-8">
          <ButtonLink href={url} external className="w-full sm:w-auto">
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
          className="block h-[48rem] w-full border-0 sm:h-[54rem]"
        />
      </div>
      <p className="mt-4 text-[0.82rem] leading-relaxed text-taupe">
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
