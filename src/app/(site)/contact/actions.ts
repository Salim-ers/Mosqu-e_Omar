"use server";

import { redirect } from "next/navigation";

import { newId, upsertRecord } from "@/lib/store";
import type { MessageRecord } from "@/lib/store/types";

/**
 * ============================================================================
 * FORMULAIRE DE CONTACT
 * ----------------------------------------------------------------------------
 * Les messages sont déposés dans l'espace bénévoles plutôt qu'envoyés par
 * courriel : aucun service tiers à souscrire ni à administrer, rien ne se perd
 * dans une boîte de réception personnelle, et l'équipe voit d'un coup d'œil ce
 * qui reste à traiter.
 *
 * Anti-spam sans traceur ni captcha :
 *  – un champ leurre invisible, que seuls les robots remplissent ;
 *  – un délai minimal entre l'affichage du formulaire et l'envoi.
 * ============================================================================
 */

const DELAI_MINIMAL_MS = 3000;
const LONGUEUR_MAX = 4000;

export async function sendMessage(formData: FormData): Promise<void> {
  const champ = (nom: string) => String(formData.get(nom) ?? "").trim();

  const echec = (message: string) =>
    redirect(`/contact?erreur=${encodeURIComponent(message)}`);

  // Leurre : un humain ne le voit pas, un robot le remplit.
  if (champ("site")) redirect("/contact?ok=1");

  const ouvertA = Number.parseInt(champ("ouvertA"), 10);
  if (
    Number.isFinite(ouvertA) &&
    Date.now() - ouvertA < DELAI_MINIMAL_MS
  ) {
    echec("Message envoyé trop vite — merci de réessayer.");
  }

  const name = champ("name");
  const email = champ("email");
  const body = champ("body");

  if (name.length < 2) echec("Merci d’indiquer votre nom.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    echec("Merci d’indiquer une adresse email valide.");
  }
  if (body.length < 10) {
    echec("Merci d’écrire votre message (quelques mots suffisent).");
  }

  const message: MessageRecord = {
    id: newId(),
    createdAt: new Date().toISOString(),
    name: name.slice(0, 120),
    email: email.slice(0, 160),
    phone: champ("phone").slice(0, 40),
    subject: champ("subject").slice(0, 160) || "Sans objet",
    body: body.slice(0, LONGUEUR_MAX),
    read: false,
  };

  await upsertRecord("messages", message);

  redirect("/contact?ok=1");
}
