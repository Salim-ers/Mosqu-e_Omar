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

/**
 * Affichée dans le cadre lorsque le paiement n'a pas abouti. Sobre et sans
 * ressource extérieure : c'est une page d'excuse, elle doit s'afficher même
 * quand tout le reste a échoué.
 */
const PAGE_ECHEC = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Le paiement n’a pas abouti</title>
<style>
  body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;
       background:#faf7f2;color:#2b2b28;font:400 16px/1.7 ui-serif,Georgia,serif;padding:2rem}
  div{max-width:26rem;text-align:center}
  h1{font-size:1.5rem;font-weight:500;margin:0 0 1rem}
  p{margin:0 0 1.5rem;color:#5c574e;font-size:.95rem}
  a{display:inline-block;padding:.85rem 1.75rem;border:1px solid #1b1b18;color:#1b1b18;
    text-decoration:none;font:600 .72rem/1 ui-sans-serif,system-ui;letter-spacing:.2em;
    text-transform:uppercase}
  a:hover{background:#1b1b18;color:#faf7f2}
</style></head>
<body><div>
  <h1>Le paiement n’a pas abouti</h1>
  <p>Rien n’a été prélevé. Votre banque a refusé l’opération, ou elle a été
  interrompue. Vous pouvez recommencer, ou donner par virement ou en main
  propre à la mosquée.</p>
  <a href="/don-formulaire">Recommencer</a>
</div></body></html>`;

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

  // Carte refusée : le formulaire renvoie le donateur, en GET, sur l'adresse
  // d'envoi du don. L'ancien site répond « Forbidden » — cette adresse-là
  // n'accepte qu'un envoi. Plutôt que ce mot sec en plein milieu de la page,
  // on explique ce qui s'est passé et on propose de recommencer.
  if (
    request.method === "GET" &&
    recue.searchParams.get("givewp-route") === "donate"
  ) {
    return new NextResponse(PAGE_ECHEC, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

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
