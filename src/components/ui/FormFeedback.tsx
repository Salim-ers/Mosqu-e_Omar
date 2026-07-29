"use client";

import { useSearchParams } from "next/navigation";

/**
 * Message de confirmation ou d'erreur d'un formulaire, lu côté navigateur.
 *
 * Le paramètre d'URL est lu ici, et non dans la page : dès qu'une page serveur
 * lit `searchParams`, Next.js la rend à chaque requête. Les pages Contact et
 * Inscriptions y perdaient leur pré-rendu — 67 ms de serveur au lieu de 3 ms
 * de cache, plus un aller-retour avec la base à chaque visite. En déplaçant
 * cette seule lecture dans un composant client, les deux pages redeviennent
 * statiques et le message continue de s'afficher.
 */
export function FormFeedback({
  succes,
  children,
}: {
  /** Titre et texte affichés après un envoi réussi. */
  succes: { titre: string; texte: string };
  /** Le formulaire, affiché tant qu'il n'a pas abouti. */
  children: React.ReactNode;
}) {
  const params = useSearchParams();
  const ok = params.get("ok");
  const erreur = params.get("erreur");

  if (ok) {
    return (
      <div className="border hairline bg-ivory p-8 sm:p-10">
        <p className="font-display text-3xl font-medium text-charcoal">
          {succes.titre}
        </p>
        <p className="mt-4 max-w-xl text-[0.98rem] leading-[1.85] text-charcoal/70">
          {succes.texte}
        </p>
      </div>
    );
  }

  return (
    <>
      {erreur ? (
        <p
          role="alert"
          className="mb-6 rounded-[2px] border border-[#8a2a20]/25 bg-[#8a2a20]/6 px-4 py-3 text-[0.9rem] text-[#8a2a20]"
        >
          {erreur}
        </p>
      ) : null}
      {children}
    </>
  );
}
