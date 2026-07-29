"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  canonicalEmail,
  createUser,
  endSession,
  getUsers,
  hashPassword,
  passwordProblem,
  requireAdmin,
  requireUser,
} from "@/lib/auth";
import { logActivity } from "@/lib/admin/journal";
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
import type {
  CollectionName,
  Collections,
  Reglages,
  UserRole,
} from "@/lib/store/types";

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

/** Titre lisible d'un enregistrement, pour le journal d'activité. */
function titreDe(record: AdminRecord, champ: string): string {
  const valeur = record[champ];
  return typeof valeur === "string" && valeur.trim().length > 0
    ? valeur.trim()
    : "un élément sans titre";
}

/* ---------------------------------------------------------- contenus --- */

export async function saveResource(
  resourceKey: string,
  id: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();

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
  await logActivity({
    userId: user.id,
    userName: user.name,
    action: existing ? "modification" : "creation",
    scope: def.label,
    label: titreDe(result.record, def.titleField),
  });
  refreshPublicSite();
  redirect(`/admin/contenus/${def.key}?ok=enregistre`);
}

export async function deleteResource(
  resourceKey: string,
  id: string,
): Promise<void> {
  const user = await requireUser();

  const def = getResource(resourceKey);
  if (!def) redirect("/admin?erreur=rubrique-inconnue");

  const record = (await findRecord(contentKey(def.key), id)) as AdminRecord | null;
  await deleteRecord(contentKey(def.key), id);
  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "suppression",
    scope: def.label,
    label: record ? titreDe(record, def.titleField) : "un élément",
  });
  refreshPublicSite();
  redirect(`/admin/contenus/${def.key}?ok=supprime`);
}

/** Bascule « en ligne / brouillon » depuis la liste, sans ouvrir le formulaire. */
export async function toggleResourcePublished(
  resourceKey: string,
  id: string,
): Promise<void> {
  const user = await requireUser();

  const def = getResource(resourceKey);
  if (!def) redirect("/admin?erreur=rubrique-inconnue");

  const record = (await findRecord(contentKey(def.key), id)) as AdminRecord | null;
  if (record) {
    await saveContent(contentKey(def.key), {
      ...record,
      published: !record.published,
      updatedAt: new Date().toISOString(),
    });
    await logActivity({
      userId: user.id,
      userName: user.name,
      action: record.published ? "depublication" : "publication",
      scope: def.label,
      label: titreDe(record, def.titleField),
    });
    refreshPublicSite();
  }
  redirect(`/admin/contenus/${def.key}?ok=statut`);
}

export async function importExistingContent(): Promise<void> {
  const user = await requireAdmin();
  const done = await importStaticContent();
  if (done.length > 0) {
    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "import",
      scope: "Contenus d’origine",
      label: done.join(", "),
    });
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
  const user = await requireUser();
  await removeMedia(id);
  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "suppression",
    scope: "Photothèque",
    label: "une photo",
  });
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
  const user = await requireUser();
  await deleteRecord("messages", id);
  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "suppression",
    scope: "Messages",
    label: "un message de contact",
  });
  redirect("/admin/messages?ok=1");
}

/* --------------------------------------------------------- réglages --- */

export async function saveSettings(formData: FormData): Promise<void> {
  const user = await requireAdmin();

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

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "reglages",
    scope: "Réglages du site",
    label: "les informations générales",
  });
  refreshPublicSite();
  redirect("/admin/reglages?ok=enregistre");
}

/* ---------------------------------------------------------- comptes --- */

export async function createVolunteer(formData: FormData): Promise<void> {
  const auteur = await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role: UserRole = formData.get("role") === "admin" ? "admin" : "editeur";

  const fail = (message: string) =>
    redirect(`/admin/utilisateurs?erreur=${encodeURIComponent(message)}`);

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fail("Adresse email invalide.");
  if (!name) fail("Indiquez le prénom et le nom du bénévole.");

  const problem = passwordProblem(password);
  if (problem) fail(problem);

  const users = await getUsers();
  if (users.some((user) => canonicalEmail(user.email) === canonicalEmail(email))) {
    fail("Un compte utilise déjà cette adresse email.");
  }

  await createUser({ email, name, password, role });
  await logActivity({
    userId: auteur.id,
    userName: auteur.name,
    action: "compte",
    scope: "Comptes bénévoles",
    label: `création du compte de ${name}`,
  });
  redirect("/admin/utilisateurs?ok=compte-cree");
}

export async function setVolunteerActive(
  id: string,
  active: boolean,
): Promise<void> {
  const current = await requireAdmin();
  if (current.id === id) {
    redirect(
      "/admin/utilisateurs?erreur=" +
        encodeURIComponent("Vous ne pouvez pas désactiver votre propre compte."),
    );
  }

  const user = (await getUsers()).find((u) => u.id === id);
  if (user) {
    await upsertRecord("utilisateurs", { ...user, active });
    await logActivity({
      userId: current.id,
      userName: current.name,
      action: "compte",
      scope: "Comptes bénévoles",
      label: `${active ? "réactivation" : "désactivation"} du compte de ${user.name}`,
    });
  }
  redirect("/admin/utilisateurs?ok=statut");
}

export async function setVolunteerRole(
  id: string,
  role: UserRole,
): Promise<void> {
  const current = await requireAdmin();
  const users = await getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) redirect("/admin/utilisateurs?erreur=Compte%20introuvable.");

  const remainingAdmins = users.filter(
    (u) => u.role === "admin" && u.active && u.id !== id,
  ).length;
  if (role !== "admin" && remainingAdmins === 0) {
    redirect(
      "/admin/utilisateurs?erreur=" +
        encodeURIComponent("Il doit rester au moins un responsable."),
    );
  }
  if (current.id === id && role !== "admin") {
    redirect(
      "/admin/utilisateurs?erreur=" +
        encodeURIComponent("Vous ne pouvez pas retirer votre propre rôle."),
    );
  }

  await upsertRecord("utilisateurs", { ...user, role });
  await logActivity({
    userId: current.id,
    userName: current.name,
    action: "compte",
    scope: "Comptes bénévoles",
    label: `${user.name} passe ${role === "admin" ? "responsable" : "éditeur"}`,
  });
  redirect("/admin/utilisateurs?ok=role");
}

/** Réinitialisation d'un mot de passe par un responsable. */
export async function resetVolunteerPassword(
  id: string,
  formData: FormData,
): Promise<void> {
  const auteur = await requireAdmin();

  const password = String(formData.get("password") ?? "");
  const problem = passwordProblem(password);
  if (problem) {
    redirect(`/admin/utilisateurs?erreur=${encodeURIComponent(problem)}`);
  }

  const user = (await getUsers()).find((u) => u.id === id);
  if (user) {
    await upsertRecord("utilisateurs", {
      ...user,
      passwordHash: await hashPassword(password),
    });
    await logActivity({
      userId: auteur.id,
      userName: auteur.name,
      action: "compte",
      scope: "Comptes bénévoles",
      label: `mot de passe réinitialisé pour ${user.name}`,
    });
  }
  redirect("/admin/utilisateurs?ok=mot-de-passe");
}

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
