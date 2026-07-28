# Mosquée Omar Ibn al Khattab — Creil · Site officiel

Nouveau site de la mosquée Omar Ibn al Khattab (Creil, Oise), portée par
l’association **ACCMPR** depuis 2013.

Stack : **Next.js (App Router) · TypeScript strict · Tailwind CSS v4 · GSAP ·
next/image · next/font** — WordPress conservé en **CMS headless**, horaires de
prière via **MAWAQIT** (source officielle, jamais recalculée).

---

## 1. Installation

Prérequis : Node.js ≥ 20.

```bash
npm install
```

## 2. Variables d’environnement

```bash
cp .env.example .env.local
```

Toutes les variables ont un **repli sûr codé dans `src/config/site.ts`** : le
site fonctionne sans `.env`. Variables disponibles :

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (canonique, sitemap, Open Graph) |
| `WORDPRESS_BASE_URL` | Racine du WordPress (aujourd’hui `https://mosqueeomarcreil.fr`) |
| `WORDPRESS_API_URL` | (Optionnel) URL complète de l’API REST si non standard |
| `NEXT_PUBLIC_MAWAQIT_EMBED_URL` | Widget MAWAQIT intégré (`…/fr/m/omar-creil`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_PHONE` | Coordonnées |
| `NEXT_PUBLIC_DONATION_URL` / `NEXT_PUBLIC_MONTHLY_DONATION_URL` | Pages de don existantes |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Carte (chargée après clic uniquement) |
| `NEXT_PUBLIC_USE_LOCAL_MEDIA` | `true` pour servir les photos depuis `/public/media` |

## 3. Développement

```bash
npm run dev        # http://localhost:3000
npm run lint       # ESLint
npx tsc --noEmit   # Vérification TypeScript
```

## 4. Build de production

```bash
npm run build
npm start
```

Le build **réussit même si le WordPress est injoignable** : chaque requête CMS
a un timeout de 8 s et un contenu de secours (annonces locales, message
d’indisponibilité élégant sur `/actualites`).

## 5. WordPress headless (contenus)

Le WordPress existant reste l’outil de publication de l’association ; le
nouveau site le consomme via l’API REST (`/wp-json/wp/v2`), avec
revalidation ISR d’une heure et HTML strictement assaini
(`src/lib/sanitize.ts` — aucun script tiers injecté).

- **Articles** → listés sur `/actualites`, détail sur `/actualites/[slug]`.
- **Annonces d’accueil** → créez une catégorie WordPress avec le slug
  **`annonces`** : ses articles remontent en page d’accueil et expirent
  automatiquement après 45 jours (anti-contenu obsolète). Les annonces
  « curées » à durée maîtrisée se gèrent dans
  `src/content/announcements.ts` (champs `publishedAt`, `startsAt`,
  `endsAt`, `isPinned`).
- **Page « projet »** → si une page WordPress au slug `projet` existe, son
  contenu s’affiche dans la section « Le mot de l’association » de `/projet`.

Fichiers : `src/lib/wordpress/{client,types,queries,mapper}.ts`.

## 6. MAWAQIT (horaires de prière)

Les horaires proviennent **exclusivement** du widget officiel MAWAQIT de la
mosquée (`https://mawaqit.net/fr/m/omar-creil` — fiche `omar-creil`,
ID 6812). Le site **n’invente ni ne calcule aucun horaire**. L’horaire de la
Jumu‘a affiché (13 h 15) est celui annoncé par la mosquée sur MAWAQIT ; il se
règle dans `src/config/site.ts` (`mawaqit.jumua`, mettre `null` pour ne rien
afficher hors widget).

## 7. Nom de domaine

Le site est prévu pour `https://mosqueeomarcreil.fr`. Une fois le projet
déployé (voir §8), pointez le domaine vers Vercel (enregistrement `A`/`CNAME`
fournis par Vercel → Settings → Domains) et renseignez
`NEXT_PUBLIC_SITE_URL=https://mosqueeomarcreil.fr`.

## 8. Déploiement Vercel

1. Poussez ce dossier sur un dépôt Git (GitHub, GitLab…).
2. Sur vercel.com : **Add New → Project** → importez le dépôt (framework
   Next.js détecté automatiquement).
3. Copiez les variables de `.env.example` dans **Settings → Environment
   Variables**.
4. Déployez. Les en-têtes de sécurité (CSP, `X-Frame-Options`,
   `Referrer-Policy`…) sont déjà configurés dans `next.config.ts` — la CSP
   n’autorise que MAWAQIT et Google Maps en iframe.

## 9. Migration vers `cms.mosqueeomarcreil.fr`

Objectif final : le WordPress sur un sous-domaine, le site Next.js sur le
domaine principal.

1. Déplacez/copiez le WordPress vers `https://cms.mosqueeomarcreil.fr`
   (hébergeur actuel, nouveau vhost + certificat).
2. Dans Vercel, mettez `WORDPRESS_BASE_URL=https://cms.mosqueeomarcreil.fr`.
3. Exécutez `npm run media:download` puis passez
   `NEXT_PUBLIC_USE_LOCAL_MEDIA=true` (les photos sont alors servies par le
   nouveau site, plus aucune dépendance d’affichage au WordPress).
4. Basculez le domaine principal vers Vercel (§7). Le WordPress ne sert plus
   que d’interface de rédaction.

## 10. Maintenance courante

- **Annonces** : ajouter/dater dans `src/content/announcements.ts` (ou via la
  catégorie WordPress `annonces`). Une annonce expirée disparaît seule.
- **Inscriptions** : statuts `OPEN / COMING_SOON / CLOSED` dans
  `src/config/registrations.ts`.
- **Services** : liste dans `src/content/services.ts`.
- **Activités** : contenus dans `src/content/activities.ts`.
- **Photos** : `npm run media:download` rapatrie les photographies et le logo
  (tente d’abord les originaux pleine résolution, sinon les variantes
  vérifiées).

---

## ✅ À valider par l’association (TODO humains)

Ces points sont **volontairement centralisés** et marqués `TODO` dans le code :

1. **Adresse** — le site actuel affiche à la fois « 1 rue **Lamartine** »
   (lien Google Maps) et « 1 rue **Larmartine** » (texte). Le nouveau site
   utilise « Lamartine » partout via `src/config/site.ts` : **confirmer
   l’orthographe officielle** et corriger à un seul endroit si besoin.
2. **Jumu‘a** — 13 h 15 est l’horaire annoncé sur MAWAQIT ; vérifier s’il
   varie selon la saison (`src/config/site.ts → mawaqit.jumua`).
3. **Statuts d’inscription** — ajuster à chaque rentrée
   (`src/config/registrations.ts`).
4. **Services** — faire relire la liste (`src/content/services.ts`).
5. **Textes alternatifs des photos** — les descriptions (`src/lib/media.ts`)
   sont factuelles mais générales ; les préciser après visionnage.
6. **Réseaux sociaux** — aucun compte officiel n’a été trouvé lors de
   l’audit ; ajouter le cas échéant dans `src/config/site.ts → socials`.
7. **Mentions légales** — confirmer le directeur de publication ;
   l’hébergeur indiqué est Vercel (§8).
8. **Déduction fiscale 66 %** — mention reprise du site actuel ; à
   confirmer avec le trésorier (association cultuelle/culturelle).

## Notes

- Aucune photo d’une autre mosquée, aucun texte fictif, aucun horaire
  inventé : tout contenu factuel provient de l’audit du site actuel et de la
  fiche MAWAQIT officielle.
- Accessibilité : navigation clavier complète (menu, galerie), lien
  d’évitement, `prefers-reduced-motion` respecté partout, contrastes AA.
