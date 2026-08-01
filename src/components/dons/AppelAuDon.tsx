import { ButtonLink } from "@/components/ui/Button";

/**
 * ============================================================================
 * L'APPEL AU DON
 * ----------------------------------------------------------------------------
 * Un bouton, qui ouvre la page de paiement de l'association dans un nouvel
 * onglet.
 *
 * Le formulaire de l'association a été intégré ici, et il s'affichait ; mais
 * le paiement, lui, n'aboutissait pas. Ce formulaire lit l'adresse de la page
 * qui l'encadre, dialogue avec elle, et fait ouvrir à la banque du donateur un
 * écran de confirmation qui s'accommode mal d'un cadre dans un cadre. Chaque
 * obstacle levé en découvrait un autre, et chaque essai coûtait un vrai
 * paiement.
 *
 * Un don qui aboutit vaut mieux qu'un don qui reste sur le site. Le jour où
 * l'association disposera de son compte Stripe, le formulaire pourra être
 * refait ici, sans rien emprunter à personne.
 * ============================================================================
 */
export function AppelAuDon({
  url,
  libelle,
  note,
}: {
  url: string;
  libelle: string;
  note: string;
}) {
  return (
    <div className="border hairline bg-cream p-8 sm:p-10">
      <p className="max-w-md text-[1.02rem] leading-[1.85] text-charcoal/75">
        Vous choisissez votre montant sur la page de paiement sécurisée de
        l’association, puis vous revenez ici.
      </p>
      <div className="mt-8">
        <ButtonLink href={url} external className="w-full sm:w-auto">
          {libelle}
        </ButtonLink>
      </div>
      <p className="mt-5 text-[0.78rem] leading-relaxed text-taupe">{note}</p>
    </div>
  );
}
