"use server";

import { redirect } from "next/navigation";

import { getInscriptions } from "@/lib/content";
import { newId, upsertRecord } from "@/lib/store";
import type { InscritRecord } from "@/lib/store/types";

/**
 * ============================================================================
 * DEMANDE D'INSCRIPTION
 * ----------------------------------------------------------------------------
 * Les demandes arrivent dans l'espace bénévoles, groupées par cours : la
 * mosquée voit d'un coup d'œil qui s'est inscrit à quoi, sans tenir de liste
 * en parallèle.
 *
 * Seuls les cours effectivement ouverts sont acceptés — un cours clos ne peut
 * pas recevoir d'inscription, même en modifiant le formulaire.
 *
 * Anti-spam sans traceur ni captcha : champ leurre et délai minimal d'envoi.
 * ============================================================================
 */

const DELAI_MINIMAL_MS = 3000;

export async function inscrire(formData: FormData): Promise<void> {
  const champ = (nom: string) => String(formData.get(nom) ?? "").trim();

  const echec = (message: string) =>
    redirect(`/inscriptions?erreur=${encodeURIComponent(message)}`);

  if (champ("site")) redirect("/inscriptions?ok=1");

  const ouvertA = Number.parseInt(champ("ouvertA"), 10);
  if (Number.isFinite(ouvertA) && Date.now() - ouvertA < DELAI_MINIMAL_MS) {
    echec("Formulaire envoyé trop vite — merci de réessayer.");
  }

  const cours = champ("cours");
  const ouverts = (await getInscriptions())
    .filter((entry) => entry.status === "OPEN")
    .map((entry) => entry.label);

  if (!ouverts.includes(cours)) {
    echec("Les inscriptions à ce cours ne sont pas ouvertes.");
  }

  const prenom = champ("prenom");
  const nom = champ("nom");
  const telephone = champ("telephone");
  const email = champ("email");

  if (prenom.length < 2 || nom.length < 2) {
    echec("Merci d’indiquer le prénom et le nom de la personne à inscrire.");
  }
  if (!telephone && !email) {
    echec("Laissez au moins un moyen de vous joindre : téléphone ou email.");
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    echec("L’adresse email ne semble pas valide.");
  }

  const inscrit: InscritRecord = {
    id: newId(),
    createdAt: new Date().toISOString(),
    cours,
    nom: nom.slice(0, 80),
    prenom: prenom.slice(0, 80),
    age: champ("age").slice(0, 40),
    contactNom: champ("contactNom").slice(0, 120),
    telephone: telephone.slice(0, 40),
    email: email.slice(0, 160),
    message: champ("message").slice(0, 1000),
    traite: false,
  };

  await upsertRecord("inscrits", inscrit);
  redirect("/inscriptions?ok=1");
}
