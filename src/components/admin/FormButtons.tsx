"use client";

import { useFormStatus } from "react-dom";

import {
  BUTTON_STYLES,
  type ButtonVariant,
} from "@/components/admin/inputStyles";

/** Bouton d'envoi qui se désactive et s'annonce pendant l'enregistrement. */
export function SubmitButton({
  children,
  pendingLabel = "Enregistrement…",
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: ButtonVariant;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={BUTTON_STYLES[variant]}>
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Bouton d'action destructrice : demande confirmation avant d'envoyer. */
export function ConfirmButton({
  children,
  question,
  pendingLabel = "Suppression…",
  variant = "danger",
  formAction,
}: {
  children: React.ReactNode;
  question: string;
  pendingLabel?: string;
  variant?: ButtonVariant;
  /** Action distincte de celle du formulaire (suppression depuis un formulaire d'édition). */
  formAction?: (formData: FormData) => void | Promise<void>;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(question)) event.preventDefault();
      }}
      className={BUTTON_STYLES[variant]}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
