import { NextResponse } from "next/server";

/**
 * ============================================================================
 * RELAIS DU FORMULAIRE DE DON
 * ----------------------------------------------------------------------------
 * Le formulaire est servi depuis notre domaine (voir /don-formulaire) ; ses
 * propres appels doivent donc repasser par nous pour rejoindre l'ancien site.
 *
 * Une simple réécriture d'adresse ne suffisait pas : le serveur de l'ancien
 * site refusait l'envoi final du don — « Forbidden ». Il regarde d'où vient la
 * requête, et voyait un autre domaine. La requête part donc d'ici avec les
 * en-têtes d'origine et de provenance de l'ancien site : de son point de vue,
 * elle vient de sa propre page de don, ce qui est la vérité — c'est bien ce
 * formulaire-là que le donateur a rempli.
 *
 * Les témoins de connexion sont transmis dans les deux sens, et leur domaine
 * retiré au passage : un témoin marqué pour l'ancien site serait refusé par le
 * navigateur ici.
 * ============================================================================
 */

const ANCIEN_SITE = "https://mosqueeomarcreil.fr";
const PAGE_FORMULAIRE = `${ANCIEN_SITE}/?givewp-route=donation-form-view&form-id=925&locale=fr_FR`;

/** Rien ne doit être mis en cache : chaque don est une requête unique. */
export const dynamic = "force-dynamic";

/** Chemins autorisés : la racine (routes du greffon) et ses fichiers. */
const CHEMINS_AUTORISES = /^(wp-content|wp-includes|wp-json)(\/|$)/;

const ENTETES_TRANSMIS = [
  "accept",
  "accept-language",
  "content-type",
  "user-agent",
  "cookie",
];

async function relais(
  request: Request,
  contexte: { params: Promise<{ chemin?: string[] }> },
): Promise<NextResponse> {
  const { chemin = [] } = await contexte.params;
  const sousChemin = chemin.join("/");

  if (sousChemin && !CHEMINS_AUTORISES.test(sousChemin)) {
    return new NextResponse(null, { status: 404 });
  }

  const recue = new URL(request.url);
  const cible = `${ANCIEN_SITE}/${sousChemin}${recue.search}`;

  const entetes = new Headers();
  for (const nom of ENTETES_TRANSMIS) {
    const valeur = request.headers.get(nom);
    if (valeur) entetes.set(nom, valeur);
  }
  entetes.set("origin", ANCIEN_SITE);
  entetes.set("referer", PAGE_FORMULAIRE);

  const corps =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const reponse = await fetch(cible, {
    method: request.method,
    headers: entetes,
    body: corps,
    redirect: "manual",
    cache: "no-store",
  });

  const type = reponse.headers.get("content-type") ?? "";
  const sortie = new Headers({ "Cache-Control": "no-store" });
  sortie.set("Content-Type", type);

  // Les témoins reviennent marqués pour l'ancien domaine : sans retirer cette
  // marque, le navigateur les jetterait et la session du don serait perdue.
  for (const témoin of reponse.headers.getSetCookie?.() ?? []) {
    sortie.append(
      "Set-Cookie",
      témoin.replace(/;\s*domain=[^;]*/gi, "").replace(/;\s*secure/gi, "; Secure"),
    );
  }

  // Une redirection de l'ancien site doit rester chez nous.
  const emplacement = reponse.headers.get("location");
  if (emplacement) {
    sortie.set("Location", emplacement.replace(ANCIEN_SITE, "/don-passerelle"));
  }

  // Texte : on ramène les adresses de l'ancien site vers le relais. Le reste
  // (images, polices, scripts) passe tel quel.
  const textuel = /^(text\/|application\/(json|javascript|xml))/.test(type);
  if (!textuel) {
    return new NextResponse(reponse.body, {
      status: reponse.status,
      headers: sortie,
    });
  }

  const contenu = (await reponse.text())
    .replaceAll(ANCIEN_SITE, "/don-passerelle")
    .replaceAll(ANCIEN_SITE.replace(/\//g, "\\/"), "\\/don-passerelle");

  return new NextResponse(contenu, { status: reponse.status, headers: sortie });
}

export const GET = relais;
export const POST = relais;
export const HEAD = relais;
