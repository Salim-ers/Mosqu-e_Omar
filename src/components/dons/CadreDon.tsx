import { ButtonLink } from "@/components/ui/Button";

/**
 * ============================================================================
 * FORMULAIRE DE DON DANS LA PAGE — QUAND C'EST POSSIBLE
 * ----------------------------------------------------------------------------
 * L'idéal serait que tous les formulaires de don s'ouvrent dans la page, sans
 * envoyer le donateur ailleurs. Tous ne l'acceptent pas.
 *
 * Le formulaire de dons ponctuels de l'association refuse de s'afficher dans
 * un cadre venu d'un autre domaine : à son démarrage il lit l'adresse de la
 * page qui l'encadre, le navigateur le lui refuse, et il s'arrête là. On le
 * sert donc depuis notre propre domaine — voir src/app/don-formulaire.
 *
 * Ce composant n'intègre que ce qui s'intègre vraiment, et donne un bouton
 * franc pour tout le reste. Un bouton qui marche vaut mieux qu'un cadre
 * blanc.
 * ============================================================================
 */

/**
 * Le formulaire de dons ponctuels, servi par nous (src/app/don-formulaire).
 * Voir cette route : c'est en le servant depuis notre propre domaine qu'il
 * accepte enfin de s'afficher.
 */
const FORMULAIRE_PONCTUEL = "/don-formulaire";

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

  // La page « Projet » du WordPress encadre le formulaire au lieu de l'être :
  // on va chercher la page du formulaire elle-même.
  if (/^https:\/\/(www\.)?mosqueeomarcreil\.fr\/projet(\/|$|\?)/i.test(propre))
    return FORMULAIRE_PONCTUEL;

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
          // Hauteur fixe, calée sur l'étape la plus haute — celle du paiement.
          // Un cadre qui grandit en cours de route ferait sauter la page sous
          // les yeux du donateur.
          className="block h-[44rem] w-full border-0 sm:h-[48rem]"
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
