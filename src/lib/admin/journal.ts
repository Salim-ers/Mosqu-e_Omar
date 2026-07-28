import "server-only";

import { deleteRecord, newId, readCollection, upsertRecord } from "@/lib/store";
import type { JournalAction, JournalRecord } from "@/lib/store/types";

/**
 * ============================================================================
 * JOURNAL D'ACTIVITÉ
 * ----------------------------------------------------------------------------
 * Chaque écriture faite depuis l'espace bénévoles laisse une ligne : qui, quoi,
 * quand. Cela répond à la question qui se pose toujours dans une équipe de
 * bénévoles — « qui a modifié ça ? » — et permet de repérer immédiatement une
 * publication faite par erreur.
 *
 * Le journal est borné : au-delà de MAX_LIGNES, les plus anciennes sont
 * effacées. Il ne grossit donc jamais indéfiniment.
 * ============================================================================
 */

const MAX_LIGNES = 300;

export const ACTION_LABELS: Record<JournalAction, string> = {
  creation: "a créé",
  modification: "a modifié",
  suppression: "a supprimé",
  publication: "a mis en ligne",
  depublication: "a retiré du site",
  reglages: "a modifié",
  compte: "a modifié le compte",
  import: "a importé",
  connexion: "s’est connecté",
  message: "a reçu",
};

export async function logActivity(entry: {
  userId: string;
  userName: string;
  action: JournalAction;
  scope: string;
  label: string;
}): Promise<void> {
  const ligne: JournalRecord = {
    id: newId(),
    at: new Date().toISOString(),
    ...entry,
  };

  try {
    await upsertRecord("journal", ligne);
    await trim();
  } catch (error) {
    // Le journal ne doit jamais empêcher un bénévole d'enregistrer son travail.
    console.error("[journal] écriture impossible", error);
  }
}

export async function readJournal(limite = 100): Promise<JournalRecord[]> {
  const lignes = await readCollection("journal");
  return [...lignes]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limite);
}

async function trim(): Promise<void> {
  const lignes = await readCollection("journal");
  if (lignes.length <= MAX_LIGNES) return;
  const trop = [...lignes]
    .sort((a, b) => a.at.localeCompare(b.at))
    .slice(0, lignes.length - MAX_LIGNES);
  for (const ligne of trop) await deleteRecord("journal", ligne.id);
}
