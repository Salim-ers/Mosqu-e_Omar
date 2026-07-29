"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  endSession,
  getUsers,
  hashPassword,
  passwordProblem,
  requireAdmin,
  requireUser,
} from "@/lib/auth";
import { buildRecord, type AdminRecord } from "@/lib/admin/records";
import { getResource } from "@/lib/admin/resources";
import { importStaticContent } from "@/lib/admin/seed";
import {
  deleteRecord,
  findRecord,
  readCollection,
  readReglages,
  upsertRecord,
  writeReglages,
} from "@/lib/store";
import { removeMedia } from "@/lib/store/media";
import type { CollectionName, Collections, Reglages } from "@/lib/store/types";

/**
 * ============================================================================
 * ACTIONS DE L'ESPACE BÉNÉVOLES
 * ----------------------------------------------------------------------------
 * Toutes les écritures passent par ces fonctions serveur. Chacune commence par
 * vérifier la session : une requête forgée sans compte valide n'écrit rien.
 * Après modification, les pages publiques sont régénérées immédiatement — un
 * bénévole voit son changement en ligne sans attendre.
 * ============================================================================
 */

function refreshPublicSite(): void {
  revalidatePath("/", "layout");
}

function contentKey(key: string): CollectionName {
  return key as CollectionName;
}

/**
 * Écrit un enregistrement construit dynamiquement. La forme exacte est
 * garantie par `buildRecord` d'après la description de la rubrique ; le
 * système de types ne peut pas la suivre jusqu'ici, d'où cette conversion
 * unique et localisée.
 */
async function saveContent(
  key: CollectionName,
  record: AdminRecord,
): Promise<void> {
  await upsertRecord(key, record as unknown as Collections[CollectionName]);
}

/* ---------------------------------------------------------- contenus --- */

export async function saveResource(
  resourceKey: string,
  id: string,
  formData: FormData,
): Promise<void> {
  await requireUser();

  const def = getResource(resourceKey);
  if (!def) redirect("/admin?erreur=rubrique-inconnue");

  const existing =
    id === "nouveau"
      ? null
      : ((await findRecord(contentKey(def.key), id)) as AdminRecord | null);

  if (id !== "nouveau" && !existing) {
    redirect(`/admin/contenus/${def.key}?erreur=introuvable`);
  }

  const result = await buildRecord(def, formData, existing);
  if (!result.ok) {
    redirect(
      `/admin/contenus/${def.key}/${id}?erreur=${encodeURIComponent(result.error)}`,
    );
  }

  await saveContent(contentKey(def.key), result.record);
  refreshPublicSite();
  redirect(`/admin/contenus/${def.key}?ok=enregistre`);
}

export async function deleteResource(
  resourceKey: string,
  id: string,
): Promise<void> {
  await requireUser();

  const def = getResource(resourceKey);
  if (!def) redirect("/admin?erreur=rubrique-inconnue");

  await deleteRecord(contentKey(def.key), id);
  refreshPublicSite();
  redirect(`/admin/contenus/${def.key}?ok=supprime`);
}

/** Bascule « en ligne / brouillon » depuis la liste, sans ouvrir le formulaire. */
export async function toggleResourcePublished(
  resourceKey: string,
  id: string,
): Promise<void> {
  await requireUser();

  const def = getResource(resourceKey);
  if (!def) redirect("/admin?erreur=rubrique-inconnue");

  const record = (await findRecord(contentKey(def.key), id)) as AdminRecord | null;
  if (record) {
    await saveContent(contentKey(def.key), {
      ...record,
      published: !record.published,
      updatedAt: new Date().toISOString(),
    });
    refreshPublicSite();
  }
  redirect(`/admin/contenus/${def.key}?ok=statut`);
}

export async function importExistingContent(): Promise<void> {
  await requireAdmin();
  const done = await importStaticContent();
  if (done.length > 0) {
  }
  refreshPublicSite();
  redirect(
    done.length > 0
      ? `/admin?ok=${encodeURIComponent(`Importé : ${done.join(", ")}.`)}`
      : "/admin?ok=Rien%20à%20importer%20—%20les%20rubriques%20sont%20déjà%20remplies.",
  );
}

/* ----------------------------------------------------------- médias --- */

export async function deleteMedia(id: string): Promise<void> {
  await requireUser();
  await removeMedia(id);
  refreshPublicSite();
  redirect("/admin/medias?ok=supprime");
}

/* --------------------------------------------------------- messages --- */

export async function toggleMessageRead(id: string): Promise<void> {
  await requireUser();
  const message = (await readCollection("messages")).find((m) => m.id === id);
  if (message) {
    await upsertRecord("messages", { ...message, read: !message.read });
  }
  redirect("/admin/messages?ok=1");
}

export async function deleteMessage(id: string): Promise<void> {
  await requireUser();
  await deleteRecord("messages", id);
  redirect("/admin/messages?ok=1");
}

/* --------------------------------------------------------- inscrits --- */

export async function toggleInscritTraite(id: string): Promise<void> {
  await requireUser();
  const inscrit = (await readCollection("inscrits")).find((i) => i.id === id);
  if (inscrit) {
    await upsertRecord("inscrits", { ...inscrit, traite: !inscrit.traite });
  }
  redirect("/admin/contenus/inscriptions?ok=inscrit");
}

export async function deleteInscrit(id: string): Promise<void> {
  await requireUser();
  await deleteRecord("inscrits", id);
  redirect("/admin/contenus/inscriptions?ok=inscrit-supprime");
}

/* --------------------------------------------------------- réglages --- */

export async function saveSettings(formData: FormData): Promise<void> {
  await requireAdmin();

  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const socials: Reglages["socials"] = text("socials")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|").map((part) => part.trim());
      return { label: label ?? "", href: href ?? "" };
    })
    .filter((social) => social.label && /^https?:\/\//.test(social.href));

  const current = await readReglages();
  await writeReglages({
    ...current,
    jumua: text("jumua"),
    bannerText: text("bannerText"),
    bannerHref: text("bannerHref"),
    bannerActive: formData.get("bannerActive") !== null,
    contactPhone: text("contactPhone"),
    contactEmail: text("contactEmail"),
    addressStreet: text("addressStreet"),
    addressPostalCode: text("addressPostalCode"),
    addressCity: text("addressCity"),
    donationUrl: text("donationUrl"),
    monthlyDonationUrl: text("monthlyDonationUrl"),
    socials,
    updatedAt: new Date().toISOString(),
  });

  refreshPublicSite();
  redirect("/admin/reglages?ok=enregistre");
}

/* ---------------------------------------------------------- comptes --- */

/** Changement de son propre mot de passe. */
export async function changeOwnPassword(formData: FormData): Promise<void> {
  const current = await requireUser();

  const password = String(formData.get("password") ?? "");
  const problem = passwordProblem(password);
  if (problem) redirect(`/admin/compte?erreur=${encodeURIComponent(problem)}`);

  const user = (await getUsers()).find((u) => u.id === current.id);
  if (user) {
    await upsertRecord("utilisateurs", {
      ...user,
      passwordHash: await hashPassword(password),
    });
  }
  redirect("/admin/compte?ok=mot-de-passe");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}
