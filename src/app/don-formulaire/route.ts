import { NextResponse } from "next/server";

/**
 * ============================================================================
 * LE FORMULAIRE DE DON, SERVI DEPUIS NOTRE DOMAINE
 * ----------------------------------------------------------------------------
 * Le formulaire de l'association est un formulaire GiveWP. Encadré depuis un
 * autre domaine, il ne s'affiche pas : à son démarrage, il lit l'adresse de la
 * page qui l'encadre, le navigateur le lui refuse — deux origines différentes —
 * et il s'arrête là. C'est ce qui laissait un cadre blanc.
 *
 * On le sert donc depuis notre propre domaine. Le formulaire se retrouve
 * « chez lui », démarre normalement, et le donateur ne quitte jamais le site
 * de la mosquée.
 *
 * Toutes les adresses de l'ancien site sont réécrites vers `/don-passerelle`,
 * qui les relaie : sans cela, le formulaire s'afficherait mais son envoi
 * serait refusé, faute d'autorisation entre domaines. Rien n'est ajouté,
 * rien n'est retiré — seule l'adresse de destination change.
 * ============================================================================
 */

const ANCIEN_SITE = "https://mosqueeomarcreil.fr";
const FORMULAIRE = `${ANCIEN_SITE}/?givewp-route=donation-form-view&form-id=925&locale=fr_FR`;

/**
 * Jamais mis en cache. Le formulaire arrive avec une signature d'envoi datée,
 * délivrée par l'ancien site : servir une copie vieille d'une heure reviendrait
 * à faire refuser le don au moment de payer.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const reponse = await fetch(FORMULAIRE, {
    headers: { "User-Agent": "mosqueeomarcreil.fr (site officiel)" },
    cache: "no-store",
  });

  if (!reponse.ok) {
    return new NextResponse(null, { status: 502 });
  }

  // Les adresses apparaissent en clair dans le HTML, et échappées dans les
  // données JSON du formulaire — d'où vient justement l'adresse d'envoi du
  // don. Les deux formes doivent être réécrites, sans quoi le formulaire
  // s'affiche mais son envoi part vers l'autre domaine, et échoue.
  const html = (await reponse.text())
    .replaceAll(ANCIEN_SITE, "/don-passerelle")
    .replaceAll(ANCIEN_SITE.replace(/\//g, "\\/"), "\\/don-passerelle");

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      // Un formulaire n'a rien à faire dans un moteur de recherche : on n'y
      // arrive que par la page « Faire un don », qui l'encadre.
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
