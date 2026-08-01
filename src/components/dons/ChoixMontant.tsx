"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { demarrerDon } from "@/app/(site)/dons/actions";
import { Button } from "@/components/ui/Button";

/**
 * Choix du montant, sur la page de la mosquée.
 *
 * Les montants proposés ne sont qu'une commodité : ils remplissent le champ,
 * qui reste modifiable. Un donateur qui veut donner 7 € ou 3 000 € n'a aucun
 * détour à faire, et personne n'a à deviner où saisir « autre montant ».
 *
 * Le champ est un vrai champ de formulaire : sans JavaScript, il part quand
 * même — seuls les boutons de suggestion cessent de fonctionner.
 */
export function ChoixMontant({
  montants,
  mensuel = false,
  defaut,
  libelle,
}: {
  montants: readonly number[];
  mensuel?: boolean;
  defaut: number;
  libelle: string;
}) {
  const [montant, setMontant] = useState(String(defaut));

  const suffixe = mensuel ? " / mois" : "";

  return (
    <form action={demarrerDon} className="border hairline bg-cream p-7 sm:p-10">
      <input type="hidden" name="mensuel" value={mensuel ? "1" : "0"} />

      <fieldset>
        <legend className="text-[0.64rem] font-semibold tracking-[0.28em] text-taupe uppercase">
          Montant de votre don
        </legend>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {montants.map((valeur) => {
            const choisi = montant === String(valeur);
            return (
              <button
                key={valeur}
                type="button"
                aria-pressed={choisi}
                onClick={() => setMontant(String(valeur))}
                className={`rounded-[2px] border py-4 font-display text-2xl font-medium transition-colors duration-200 motion-reduce:transition-none ${
                  choisi
                    ? "border-ink bg-ink text-ivory"
                    : "border-charcoal/20 bg-transparent text-charcoal hover:border-ink"
                }`}
              >
                {valeur} €
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <label
            htmlFor="montant"
            className="text-[0.82rem] font-medium text-charcoal/70"
          >
            Ou le montant de votre choix{suffixe}
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="montant"
              name="montant"
              inputMode="decimal"
              required
              value={montant}
              onChange={(event) => setMontant(event.target.value)}
              className="w-40 rounded-[2px] border border-charcoal/25 bg-ivory px-4 py-3 font-display text-2xl text-charcoal focus:border-ink focus:outline-none"
            />
            <span className="font-display text-2xl text-charcoal/45">
              €{suffixe}
            </span>
          </div>
        </div>
      </fieldset>

      <div className="mt-8">
        <BoutonDon libelle={libelle} />
      </div>

      <p className="mt-5 text-[0.78rem] leading-relaxed text-taupe">
        Paiement sécurisé par carte bancaire. Votre numéro de carte n’est jamais
        vu par la mosquée.
      </p>
    </form>
  );
}

function BoutonDon({ libelle }: { libelle: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? "Un instant…" : libelle}
    </Button>
  );
}
