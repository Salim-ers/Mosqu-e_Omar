"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { inscrire } from "@/app/(site)/inscriptions/actions";

/**
 * Demande d'inscription à un cours. Volontairement court : de quoi rappeler la
 * famille, rien de plus. Le champ « site » est un leurre invisible et
 * `ouvertA` note l'heure d'affichage — deux garde-fous anti-robots qui ne
 * demandent rien au visiteur.
 */
const CHAMP =
  "w-full rounded-[2px] border border-charcoal/20 bg-ivory px-4 py-3 text-[0.95rem] text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-charcoal";

const LIBELLE =
  "block text-[0.64rem] font-semibold tracking-[0.22em] text-taupe uppercase";

export function InscriptionForm({ cours }: { cours: string[] }) {
  const [ouvertA] = useState(() => Date.now());

  return (
    <form action={inscrire} className="space-y-6">
      <input type="hidden" name="ouvertA" value={ouvertA} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Ne remplissez pas ce champ
          <input type="text" name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="cours" className={LIBELLE}>
          Cours souhaité <span aria-hidden>*</span>
        </label>
        <select id="cours" name="cours" required className={`${CHAMP} mt-2`}>
          {cours.map((intitule) => (
            <option key={intitule} value={intitule}>
              {intitule}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="grid gap-6 sm:grid-cols-2">
        <legend className={`${LIBELLE} mb-4`}>Personne à inscrire</legend>
        <div>
          <label htmlFor="prenom" className={LIBELLE}>
            Prénom <span aria-hidden>*</span>
          </label>
          <input
            id="prenom"
            name="prenom"
            type="text"
            required
            className={`${CHAMP} mt-2`}
          />
        </div>
        <div>
          <label htmlFor="nom" className={LIBELLE}>
            Nom <span aria-hidden>*</span>
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            className={`${CHAMP} mt-2`}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="age" className={LIBELLE}>
            Âge ou niveau
          </label>
          <input
            id="age"
            name="age"
            type="text"
            placeholder="9 ans, CM2, adulte…"
            className={`${CHAMP} mt-2`}
          />
        </div>
      </fieldset>

      <fieldset className="grid gap-6 sm:grid-cols-2">
        <legend className={`${LIBELLE} mb-4`}>Pour vous recontacter</legend>
        <div className="sm:col-span-2">
          <label htmlFor="contactNom" className={LIBELLE}>
            Nom du parent ou du responsable
          </label>
          <input
            id="contactNom"
            name="contactNom"
            type="text"
            autoComplete="name"
            className={`${CHAMP} mt-2`}
          />
        </div>
        <div>
          <label htmlFor="telephone" className={LIBELLE}>
            Téléphone
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            autoComplete="tel"
            className={`${CHAMP} mt-2`}
          />
        </div>
        <div>
          <label htmlFor="email" className={LIBELLE}>
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`${CHAMP} mt-2`}
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className={LIBELLE}>
          Précision (facultatif)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Niveau déjà atteint, disponibilités, frère ou sœur déjà inscrit…"
          className={`${CHAMP} mt-2 min-h-28 leading-relaxed`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <Envoyer />
        <p className="max-w-md text-[0.78rem] leading-relaxed text-charcoal/50">
          Un bénévole vous rappellera pour confirmer la place et vous indiquer
          les créneaux. Ces informations ne servent qu’à cela.
        </p>
      </div>
    </form>
  );
}

function Envoyer() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-[2px] border border-ink bg-ink px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-ivory uppercase transition-colors duration-300 hover:bg-zellige disabled:opacity-50 motion-reduce:transition-none"
    >
      {pending ? "Envoi…" : "Envoyer la demande"}
    </button>
  );
}
