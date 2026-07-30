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
import {
  decodeCsv,
  lireEnTete,
  ORDRE_PAR_DEFAUT,
  parseCsv,
} from "@/lib/admin/csv";
import { buildRecord, type AdminRecord } from "@/lib/admin/records";
import { getResource } from "@/lib/admin/resources";
import { importStaticContent } from "@/lib/admin/seed";
import {
  deleteRecord,
  findRecord,
  newId,
  readCollection,
  readReglages,
  upsertRecord,
  writeReglages,
} from "@/lib/store";
import { removeMedia } from "@/lib/store/media";
import type {
  CollectionName,
  Collections,
  InscritRecord,
  Reglages,
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
  // La photothèque vit désormais sous « Photos & albums » : l'ancienne adresse
  // /admin/medias n'existe plus et renvoyait une page introuvable.
  redirect("/admin/contenus/albums?ok=photo-supprimee");
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
  if (!inscrit) redirect("/admin/contenus/inscriptions");

  await upsertRecord("inscrits", { ...inscrit, traite: !inscrit.traite });
  // On revient sur la liste du cours, là où le bénévole travaillait.
  redirect(`/admin/inscrits/${encodeURIComponent(inscrit.cours)}?ok=1`);
}

export async function deleteInscrit(id: string): Promise<void> {
  await requireUser();
  const inscrit = (await readCollection("inscrits")).find((i) => i.id === id);
  await deleteRecord("inscrits", id);
  redirect(
    inscrit
      ? `/admin/inscrits/${encodeURIComponent(inscrit.cours)}?ok=1`
      : "/admin/contenus/inscriptions",
  );
}

/** Fabrique un inscrit à partir de valeurs déjà nettoyées. */
function nouvelInscrit(
  cours: string,
  valeurs: Partial<Record<string, string>>,
): InscritRecord {
  const propre = (cle: string, max: number) =>
    (valeurs[cle] ?? "").trim().slice(0, max);

  return {
    id: newId(),
    createdAt: new Date().toISOString(),
    cours,
    prenom: propre("prenom", 80),
    nom: propre("nom", 80),
    age: propre("age", 40),
    contactNom: propre("contactNom", 120),
    telephone: propre("telephone", 40),
    email: propre("email", 160),
    message: propre("message", 1000),
    traite: false,
  };
}

/** Ajout d'un inscrit à la main, depuis la page du cours. */
export async function ajouterInscrit(
  cours: string,
  formData: FormData,
): Promise<void> {
  await requireUser();

  const valeur = (nom: string) => String(formData.get(nom) ?? "").trim();
  const retour = `/admin/inscrits/${encodeURIComponent(cours)}`;

  if (valeur("prenom").length < 2 && valeur("nom").length < 2) {
    redirect(
      `${retour}?erreur=${encodeURIComponent("Indiquez au moins un prénom et un nom.")}`,
    );
  }

  await upsertRecord(
    "inscrits",
    nouvelInscrit(cours, {
      prenom: valeur("prenom"),
      nom: valeur("nom"),
      age: valeur("age"),
      contactNom: valeur("contactNom"),
      telephone: valeur("telephone"),
      email: valeur("email"),
      message: valeur("message"),
    }),
  );

  redirect(`${retour}?ok=ajoute`);
}

/**
 * Import d'une liste depuis un tableur. Les colonnes sont reconnues par leur
 * intitulé (prénom, nom, âge, responsable, téléphone, email, remarque) quel
 * que soit leur ordre ; sans en-tête, l'ordre par défaut s'applique.
 */
export async function importerInscrits(
  cours: string,
  formData: FormData,
): Promise<void> {
  await requireUser();

  const retour = `/admin/inscrits/${encodeURIComponent(cours)}`;
  const echec = (message: string) =>
    redirect(`${retour}?erreur=${encodeURIComponent(message)}`);

  const fichier = formData.get("fichier");
  if (!(fichier instanceof File) || fichier.size === 0) {
    echec("Choisissez un fichier CSV.");
    return;
  }
  if (fichier.size > 2 * 1024 * 1024) {
    echec("Fichier trop lourd — 2 Mo maximum.");
  }

  const lignes = parseCsv(decodeCsv(Buffer.from(await fichier.arrayBuffer())));
  if (lignes.length === 0) echec("Le fichier est vide.");

  const enTete = lireEnTete(lignes[0]);
  const corps = enTete ? lignes.slice(1) : lignes;

  const position = (champ: string) =>
    enTete ? enTete[champ] : ORDRE_PAR_DEFAUT.indexOf(champ);

  let ajoutes = 0;
  let ignorees = 0;

  for (const ligne of corps) {
    const lire = (champ: string) => {
      const index = position(champ);
      return index === undefined || index < 0 ? "" : (ligne[index] ?? "");
    };

    const prenom = lire("prenom");
    const nom = lire("nom");
    // Une ligne sans nom du tout n'est pas une inscription.
    if (prenom.trim().length + nom.trim().length < 2) {
      ignorees += 1;
      continue;
    }

    await upsertRecord(
      "inscrits",
      nouvelInscrit(cours, {
        prenom,
        nom,
        age: lire("age"),
        contactNom: lire("contactNom"),
        telephone: lire("telephone"),
        email: lire("email"),
        message: lire("message"),
      }),
    );
    ajoutes += 1;
  }

  if (ajoutes === 0) {
    echec(
      "Aucune inscription lisible dans ce fichier — vérifiez qu’il contient au moins une colonne prénom ou nom.",
    );
  }

  const resume =
    `${ajoutes} inscription${ajoutes > 1 ? "s" : ""} importée${ajoutes > 1 ? "s" : ""}` +
    (ignorees > 0 ? ` — ${ignorees} ligne${ignorees > 1 ? "s" : ""} vide${ignorees > 1 ? "s" : ""} ignorée${ignorees > 1 ? "s" : ""}` : "") +
    ".";
  redirect(`${retour}?ok=${encodeURIComponent(resume)}`);
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
