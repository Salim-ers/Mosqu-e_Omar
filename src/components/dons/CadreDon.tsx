import { ButtonLink } from "@/components/ui/Button";

/**
 * ============================================================================
 * FORMULAIRE DE DON DANS LA PAGE — QUAND C'EST POSSIBLE
 * ----------------------------------------------------------------------------
 * L'idéal serait que tous les formulaires de don s'ouvrent dans la page, sans
 * envoyer le donateur ailleurs. Tous ne l'acceptent pas.
 *
 * Le formulaire de dons ponctuels de l'association est un formulaire GiveWP :
 * il ne s'affiche que si le script du greffon pilote lui-même son cadre depuis
 * la page qui l'accueille. Autrement dit, il faudrait exécuter un script de
 * l'ancien site à l'intérieur de celui-ci — ce que la politique de sécurité du
 * site interdit, et pour de bonnes raisons : ce script aurait alors les mêmes
 * droits que le site lui-même. Sans ce script, le cadre reste blanc ; c'est
 * exactement ce qui s'était produit.
 *
 * Ce composant n'intègre donc que ce qui s'intègre vraiment, et donne un
 * bouton franc pour tout le reste. Un bouton qui marche vaut mieux qu'un cadre
 * blanc.
 * ============================================================================
 */

/**
 * Adresse intégrable, ou `null` s'il faut un bouton.
 *
 * La liste est délibérément courte et explicite : on n'y met que ce qui a été
 * vérifié. Une page qu'on croit intégrable et qui ne l'est pas coûte un
 * donateur.
 */
export function adresseIntegrable(url: string): string | null {
  const exacte = url.trim().split("#")[0];
  const propre = exacte.replace(/\/+$/, "");

  // Page de prélèvement mensuel de l'association : une page autonome, qui
  // n'attend rien de la page qui l'accueille.
  if (/^https:\/\/(www\.)?mosqueeomarcreil\.fr\/abonnement(\/|$|\?)/i.test(propre))
    return exacte;

  // HelloAsso publie chaque campagne en version intégrable sous « /widget ».
  if (/^https:\/\/(www\.)?helloasso\.com\/.+\/formulaires\/[^/]+/i.test(propre))
    return propre.endsWith("/widget") ? propre : `${propre}/widget`;

  return null;
}

export function CadreDon({
  url,
  titre,
  libelleBouton,
  note,
}: {
  url: string;
  titre: string;
  libelleBouton: string;
  note?: string;
}) {
  const integrable = adresseIntegrable(url);

  if (!integrable) {
    return (
      <div className="border hairline bg-cream p-8 sm:p-10">
        <p className="max-w-md text-[1.02rem] leading-[1.85] text-charcoal/75">
          Vous choisissez votre montant sur la page de paiement sécurisée de
          l’association, puis vous revenez ici.
        </p>
        <div className="mt-8">
          <ButtonLink href={url} external className="w-full sm:w-auto">
            {libelleBouton}
          </ButtonLink>
        </div>
        <p className="mt-5 text-[0.78rem] leading-relaxed text-taupe">
          {note ??
            "Paiement par carte bancaire. Votre numéro de carte n’est jamais vu par la mosquée."}
        </p>
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
