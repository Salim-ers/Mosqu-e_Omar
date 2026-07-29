"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { sendMessage } from "@/app/(site)/contact/actions";

/**
 * Formulaire de contact. Les messages arrivent dans l'espace bénévoles ; le
 * champ « site » est un leurre invisible et `ouvertA` note l'heure d'affichage
 * — deux garde-fous anti-robots qui ne demandent rien au visiteur, pas même
 * un captcha.
 */
const CHAMP =
  "w-full rounded-[2px] border border-charcoal/20 bg-cream px-4 py-3 text-[0.95rem] text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-charcoal";

const LIBELLE =
  "block text-[0.64rem] font-semibold tracking-[0.22em] text-taupe uppercase";

export function ContactForm() {
  const [ouvertA] = useState(() => Date.now());

  return (
    <form action={sendMessage} className="space-y-6">
      <input type="hidden" name="ouvertA" value={ouvertA} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Ne remplissez pas ce champ
          <input type="text" name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LIBELLE}>
            Votre nom <span aria-hidden>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={`${CHAMP} mt-2`}
          />
        </div>
        <div>
          <label htmlFor="email" className={LIBELLE}>
            Votre email <span aria-hidden>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`${CHAMP} mt-2`}
          />
        </div>
        <div>
          <label htmlFor="phone" className={LIBELLE}>
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={`${CHAMP} mt-2`}
          />
        </div>
        <div>
          <label htmlFor="subject" className={LIBELLE}>
            Objet
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Inscriptions, dons, janaza…"
            className={`${CHAMP} mt-2`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="body" className={LIBELLE}>
          Votre message <span aria-hidden>*</span>
        </label>
        <textarea
          id="body"
          name="body"
          rows={7}
          required
          minLength={10}
          className={`${CHAMP} mt-2 min-h-40 leading-relaxed`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <Envoyer />
        <p className="text-[0.78rem] leading-relaxed text-charcoal/50">
          Votre message est transmis à l’équipe de la mosquée. Pour une demande
          urgente, préférez le téléphone.
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
      {pending ? "Envoi…" : "Envoyer le message"}
    </button>
  );
}
