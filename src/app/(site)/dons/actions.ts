"use server";

import { redirect } from "next/navigation";

import { getSettings } from "@/lib/content";
import { lireMontant, ouvrirPaiement, paiementEnLigneActif } from "@/lib/dons";

/**
 * Départ d'un don. Trois issues, et aucune ne laisse le donateur devant une
 * page muette :
 *
 *  – paiement en ligne configuré → page sécurisée de Stripe ;
 *  – pas encore configuré → plateforme de don réglée dans l'espace bénévoles ;
 *  – montant impossible ou refus de Stripe → /dons/echec, qui explique.
 *
 * Les erreurs ne repassent pas par un paramètre d'adresse : les pages de don
 * resteraient à régénérer à chaque visite, et elles n'ont aucune raison de
 * l'être.
 */
export async function demarrerDon(formData: FormData): Promise<void> {
  const mensuel = formData.get("mensuel") === "1";
  const centimes = lireMontant(formData.get("montant"));

  if (centimes === null) redirect("/dons/echec");

  if (!paiementEnLigneActif()) {
    const reglages = await getSettings();
    redirect(mensuel ? reglages.monthlyDonationUrl : reglages.donationUrl);
  }

  const paiement = await ouvrirPaiement({ centimes, mensuel });
  redirect(paiement ?? "/dons/echec");
}
