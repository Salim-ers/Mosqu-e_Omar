import "server-only";

/**
 * ============================================================================
 * LECTURE D'UN FICHIER CSV
 * ----------------------------------------------------------------------------
 * Pensé pour ce qui sort réellement d'un tableur en France :
 *
 *  – séparateur point-virgule (ce qu'Excel écrit avec une locale française)
 *    aussi bien que virgule ou tabulation, détecté sur la première ligne ;
 *  – champs entre guillemets, guillemets doublés à l'intérieur ;
 *  – fins de ligne Windows comme Unix ;
 *  – marque d'ordre des octets en tête de fichier ;
 *  – encodage Windows-1252 quand ce n'est pas de l'UTF-8 — sans quoi tous les
 *    prénoms accentués arriveraient abîmés.
 *
 * Aucune dépendance : le format est simple, et une bibliothèque de plus à
 * suivre pour une poignée de lignes n'en vaut pas la peine.
 * ============================================================================
 */

/** Décode en UTF-8, avec repli sur Windows-1252 si le résultat est abîmé. */
export function decodeCsv(bytes: Buffer): string {
  const utf8 = new TextDecoder("utf-8").decode(bytes);
  if (!utf8.includes("�")) return utf8.replace(/^﻿/, "");
  return new TextDecoder("windows-1252").decode(bytes).replace(/^﻿/, "");
}

function detecteSeparateur(premiereLigne: string): string {
  const candidats = [";", ",", "\t"];
  let meilleur = ";";
  let maximum = 0;
  for (const c of candidats) {
    const n = premiereLigne.split(c).length - 1;
    if (n > maximum) {
      maximum = n;
      meilleur = c;
    }
  }
  return meilleur;
}

/** Découpe le texte en lignes de champs. */
export function parseCsv(texte: string): string[][] {
  const contenu = texte.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const separateur = detecteSeparateur(contenu.split("\n")[0] ?? "");

  const lignes: string[][] = [];
  let champs: string[] = [];
  let courant = "";
  let dansGuillemets = false;

  for (let i = 0; i < contenu.length; i += 1) {
    const c = contenu[i];

    if (dansGuillemets) {
      if (c === '"') {
        if (contenu[i + 1] === '"') {
          courant += '"';
          i += 1;
        } else {
          dansGuillemets = false;
        }
      } else {
        courant += c;
      }
      continue;
    }

    if (c === '"') {
      dansGuillemets = true;
    } else if (c === separateur) {
      champs.push(courant.trim());
      courant = "";
    } else if (c === "\n") {
      champs.push(courant.trim());
      if (champs.some((v) => v.length > 0)) lignes.push(champs);
      champs = [];
      courant = "";
    } else {
      courant += c;
    }
  }

  champs.push(courant.trim());
  if (champs.some((v) => v.length > 0)) lignes.push(champs);

  return lignes;
}

/* -------------------------------------------------------- en-têtes --- */

/** Noms de colonnes acceptés, pour chaque information attendue. */
const COLONNES: Record<string, string[]> = {
  prenom: ["prenom", "prénom", "firstname", "first name"],
  nom: ["nom", "name", "lastname", "last name", "nom de famille"],
  age: ["age", "âge", "niveau", "classe", "age ou niveau"],
  contactNom: [
    "responsable",
    "parent",
    "contact",
    "nom du parent",
    "nom du responsable",
    "tuteur",
  ],
  telephone: ["telephone", "téléphone", "tel", "tél", "portable", "phone"],
  email: ["email", "e-mail", "mail", "courriel", "adresse email"],
  message: ["message", "remarque", "remarques", "note", "notes", "precision", "précision"],
};

const normalise = (valeur: string) =>
  valeur
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Associe chaque colonne du fichier à une information attendue.
 * Renvoie `null` si la première ligne ne ressemble pas à un en-tête — le
 * fichier est alors lu dans l'ordre par défaut.
 */
export function lireEnTete(ligne: string[]): Record<string, number> | null {
  const correspondances: Record<string, number> = {};

  ligne.forEach((cellule, index) => {
    const valeur = normalise(cellule);
    for (const [champ, alias] of Object.entries(COLONNES)) {
      if (alias.some((a) => normalise(a) === valeur)) {
        if (correspondances[champ] === undefined) correspondances[champ] = index;
      }
    }
  });

  // Sans prénom ni nom reconnus, ce n'était pas un en-tête.
  if (correspondances.prenom === undefined && correspondances.nom === undefined) {
    return null;
  }
  return correspondances;
}

/** Ordre supposé quand le fichier n'a pas d'en-tête. */
export const ORDRE_PAR_DEFAUT = [
  "prenom",
  "nom",
  "age",
  "contactNom",
  "telephone",
  "email",
  "message",
];
