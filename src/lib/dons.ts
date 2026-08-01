import "server-only";

import { site } from "@/config/site";

/**
 * ============================================================================
 * DONS — OUVERTURE D'UN PAIEMENT
 * ----------------------------------------------------------------------------
 * Le formulaire de don vit sur ce site : le donateur choisit son montant sur
 * les pages de la mosquée, sans être renvoyé ailleurs pour ça. Seule la saisie
 * de la carte se fait chez Stripe, sur sa page sécurisée — c'est ce qui évite à
 * l'association d'avoir à héberger, protéger et faire certifier un formulaire
 * de carte bancaire.
 *
 * Tant que `STRIPE_SECRET_KEY` n'est pas renseignée, les boutons retombent sur
 * l'adresse de don réglée dans l'espace bénévoles : le site reste utilisable
 * pendant que l'association prépare son compte.
 *
 * Aucune dépendance ajoutée : l'API de Stripe est une API HTTP ordinaire.
 * ============================================================================
 */

/** Montants proposés, en euros. Le donateur peut toujours saisir le sien. */
export const MONTANTS_PONCTUELS = [20, 50, 100, 200] as const;
export const MONTANTS_MENSUELS = [10, 20, 50] as const;

/** Bornes de bon sens : sous 1 €, les frais dépassent le don. */
const MINIMUM_EUROS = 1;
const MAXIMUM_EUROS = 10000;

export function paiementEnLigneActif(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Lit un montant saisi par un humain : « 20 », « 20,50 », « 20.50 », « 20 € ».
 * Renvoie des centimes, ou `null` si ce n'est pas un montant acceptable.
 */
export function lireMontant(saisie: unknown): number | null {
  const texte = String(saisie ?? "")
    .replace(/[^\d.,]/g, "")
    .replace(",", ".");
  if (!texte) return null;

  const euros = Number(texte);
  if (!Number.isFinite(euros)) return null;
  if (euros < MINIMUM_EUROS || euros > MAXIMUM_EUROS) return null;

  return Math.round(euros * 100);
}

/**
 * Ouvre une session de paiement Stripe et renvoie l'adresse où envoyer le
 * donateur. `mensuel` crée un abonnement prélevé chaque mois, que le donateur
 * peut interrompre lui-même depuis le courriel de confirmation de Stripe.
 */
export async function ouvrirPaiement({
  centimes,
  mensuel,
}: {
  centimes: number;
  mensuel: boolean;
}): Promise<string | null> {
  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) return null;

  const intitule = mensuel
    ? `Soutien mensuel — ${site.name}`
    : `Don — ${site.name}`;

  const params = new URLSearchParams({
    mode: mensuel ? "subscription" : "payment",
    locale: "fr",
    success_url: `${site.url}/dons/merci`,
    cancel_url: `${site.url}/dons`,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(centimes),
    "line_items[0][price_data][product_data][name]": intitule,
  });
  if (mensuel) {
    params.set("line_items[0][price_data][recurring][interval]", "month");
  } else {
    // Le donateur reçoit son justificatif de paiement sans avoir à le demander.
    params.set("invoice_creation[enabled]", "true");
  }

  const reponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cle}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
    cache: "no-store",
  });

  if (!reponse.ok) return null;
  const session = (await reponse.json()) as { url?: string };
  return session.url ?? null;
}
