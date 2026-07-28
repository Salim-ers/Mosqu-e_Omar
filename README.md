# Mosquée Omar Ibn al Khattab — Creil · Site officiel

Nouveau site de la mosquée Omar Ibn al Khattab (Creil, Oise), portée par
l’association **ACCMPR** depuis 2013.

Stack : **Next.js (App Router) · TypeScript strict · Tailwind CSS v4 · GSAP ·
next/image · next/font** — **espace bénévoles intégré** (`/admin`) pour la mise
à jour des contenus, WordPress conservé en **CMS headless** de transition,
horaires de prière via **MAWAQIT** (source officielle, jamais recalculée).

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
| `DATABASE_URL` | Base Postgres (Supabase, Neon…). **Dès qu’elle est renseignée, tout est stocké en base** |
| `DATA_DIR` | Dossier des contenus si aucune base n’est configurée (défaut : `.data`) |
| `AUTH_SECRET` | Secret de signature des sessions (généré automatiquement sinon) |

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

---

## 🔑 Espace bénévoles (`/admin`)

Les bénévoles de l’association mettent le site à jour eux-mêmes, sans toucher
au code : **https://mosqueeomarcreil.fr/admin**.

### Premier accès

Au tout premier chargement de `/admin`, aucune page de connexion classique ne
s’affiche : le formulaire propose de **créer le compte responsable**. Ce compte
crée ensuite ceux des autres bénévoles (rubrique « Comptes bénévoles »). Deux
rôles :

| Rôle | Peut faire |
| --- | --- |
| **Responsable** (`admin`) | tout, y compris les réglages du site et la gestion des comptes |
| **Éditeur** (`editeur`) | tous les contenus (annonces, actualités, janaza, événements, photos…) |

### Ce qui est modifiable

| Rubrique | Contenu | Où ça s’affiche |
| --- | --- | --- |
| **Annonces** | messages courts datés | accueil + `/actualites` |
| **Actualités** | articles complets (photo, texte mis en forme) | `/actualites` et `/actualites/<adresse>` |
| **Janaza** | prières funéraires | bloc d’accueil + `/janaza` |
| **Événements** | Aïd, iftars, conférences, collectes | `/evenements` |
| **Activités** | cours de Coran, arabe, soutien scolaire… | accueil + `/activites` |
| **Services** | espace femmes, ablutions, accès PMR… | accueil |
| **Photos & albums** | photos d’événements regroupées par album | `/galerie` |
| **Inscriptions** | statuts ouvertes / prochainement / closes | `/inscriptions` |
| **Réglages du site** | Jumu‘a, bandeau d’information, coordonnées, liens de don, réseaux | tout le site |
| **Messages** | les messages reçus via le formulaire de contact | boîte de réception de l’admin |
| **Journal d’activité** | qui a modifié quoi, et quand | tableau de bord + `/admin/journal` |

Chaque contenu a une case **« Visible sur le site »** (brouillon si décochée).
Les contenus datés (annonces, janaza, événements) **disparaissent tout seuls** à
échéance : aucune information périmée ne peut rester affichée.

### Reprendre les contenus existants

Les activités, services, inscriptions et annonces livrés avec le code
s’importent en un clic depuis le tableau de bord (**« Importer les contenus
existants »**). Tant qu’une rubrique n’a pas été reprise en main, le site
continue d’afficher les contenus d’origine : rien ne peut disparaître par
inadvertance.

### Écriture des articles

Les articles se rédigent en texte courant, avec quelques conventions :

```
## Titre de section          ### Sous-titre
- élément de liste           > citation
**gras**   *italique*   [texte du lien](https://…)
```

Le texte saisi est intégralement échappé avant d’être converti en HTML : aucune
balise ne peut être injectée depuis l’admin.

### Photos

Les photos sont **réduites dans le navigateur** (1800 px de côté, JPEG) avant
l’envoi : un bénévole peut choisir une photo prise au téléphone sans se
préoccuper de son poids. Elles sont écrites dans le dossier de données et
servies par la route `/uploads/<fichier>`. Pensez à remplir la **description de
l’image** — c’est ce que lisent les personnes non voyantes.

### Où sont stockés les contenus

Deux modes, choisis automatiquement selon l’environnement :

| | Quand | Où |
| --- | --- | --- |
| **Base de données** | dès que `DATABASE_URL` est renseignée | tables `site_records`, `site_documents`, `site_files` |
| **Fichiers** | sinon | dossier `.data/` (ou `DATA_DIR`) |

Le mode actif est affiché en bas de la colonne de gauche dans `/admin`
(« Contenus enregistrés — base de données » / « — fichiers »).

**En base**, les tables sont créées toutes seules au premier démarrage : aucun
SQL à exécuter à la main. Les photos sont stockées dans la table `site_files`
plutôt que dans un service séparé — elles sont déjà réduites par le navigateur
avant l’envoi, et cela fait une dépendance de moins à administrer.

**En fichiers**, un JSON par collection, les photos dans `.data/uploads/`.
Écriture atomique (fichier temporaire puis renommage) et file d’attente par
collection : deux bénévoles qui enregistrent en même temps ne peuvent pas se
faire perdre leurs modifications. Ce mode suppose un **disque persistant** —
parfait en développement, sur un VPS ou dans un conteneur avec volume ; à
proscrire sur un hébergement serverless.

Toute l’application ne parle qu’à l’API de `src/lib/store/` : changer
d’hébergement ne demande aucune modification ailleurs dans le code.

### Suivre ce qui se passe

Trois choses remontent d’elles-mêmes dans l’espace bénévoles :

- **Messages** — le formulaire de contact du site dépose les messages ici,
  pas dans une boîte mail personnelle. Le nombre de messages en attente
  s’affiche dans la colonne de gauche, et un rappel reste sur le tableau de
  bord tant qu’ils ne sont pas traités.
- **Journal d’activité** — qui a créé, modifié, publié, retiré ou supprimé
  quoi, et quand. Les huit dernières actions sont sur le tableau de bord, les
  150 dernières sur `/admin/journal`. Répond à la question qui se pose
  toujours dans une équipe (« qui a modifié ça ? ») et permet de repérer tout
  de suite une publication faite par erreur.
- **Brouillons** — chaque rubrique indique combien de contenus ne sont pas
  encore en ligne.

Le journal est borné : au-delà de 150 lignes, les plus anciennes s’effacent.
Il ne grossit jamais indéfiniment.


### Sécurité

- mots de passe dérivés par **scrypt** (sel aléatoire par compte), jamais
  stockés ni journalisés en clair ;
- session dans un **cookie signé HMAC-SHA256**, `httpOnly` + `sameSite=lax`,
  7 jours ; secret dans `AUTH_SECRET`, sinon généré une fois dans `.data` ;
- message d’échec identique que l’adresse existe ou non, et **temporisation
  d’une minute** au-delà de six tentatives ;
- `/admin` est en `noindex` et n’est jamais rendu statiquement ;
- toutes les écritures passent par des actions serveur qui **revérifient la
  session** ; les envois d’images vérifient type et poids côté serveur.

---

---

## 🗄️ Supabase (recommandé avec Vercel)

Sur Vercel, le disque est éphémère : sans base de données, les contenus saisis
par les bénévoles seraient perdus au redéploiement. Supabase fournit le
Postgres qu’il faut, gratuitement pour un site d’association.

### 1. Créer le projet

1. Sur [supabase.com](https://supabase.com) → **New project**.
2. Nom : `mosquee-omar`. Région : **Europe (Frankfurt ou Paris)** — au plus
   près des visiteurs.
3. Notez le mot de passe de la base : il n’est affiché qu’une fois.

Aucune table à créer : le site s’en charge au premier démarrage.

### 2. Récupérer l’adresse de connexion

Dans le projet Supabase → **Connect** (en haut) → onglet **Connection string**
→ **Transaction pooler** (port `6543`).

> ⚠️ Prenez bien le **pooler**, pas la connexion directe : Vercel ouvre une
> connexion par requête, et une base Postgres n’en accepte qu’un nombre
> limité simultanément. Le pooler est fait pour ça.

Remplacez `[YOUR-PASSWORD]` par le mot de passe noté à l’étape 1 :

```
postgresql://postgres.abcdefgh:MOT-DE-PASSE@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### 3. Vérifier avant de déployer

```bash
npm run db:verifier -- "postgresql://…"
```

Le script se connecte, crée les tables, écrit puis relit un contenu et une
photo, et nettoie derrière lui. Il dit en clair ce qui ne va pas le cas
échéant.

### 4. Renseigner les variables sur Vercel

**Settings → Environment Variables** :

| Variable | Valeur |
| --- | --- |
| `DATABASE_URL` | l’adresse du pooler, mot de passe compris |
| `AUTH_SECRET` | une longue chaîne aléatoire (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | `https://mosqueeomarcreil.fr` |

Puis redéployez.

### 5. Créer le compte responsable

Deux façons, au choix.

**Depuis le site** — ouvrez **`/admin`** : aucun compte n’existant encore, le
formulaire propose de **créer le compte responsable**. Renseignez nom, email et
mot de passe.

**Depuis le terminal**, pour préparer le compte avant la mise en ligne :

```bash
npm run admin:creer -- --email imam@exemple.fr --nom "Prénom Nom"
```

Le mot de passe est tiré au sort et affiché **une seule fois** ; ajoutez
`--mdp "…"` pour le choisir vous-même. Le script écrit là où le site lit
(base de données si `DATABASE_URL` est renseignée, dossier de données sinon),
et refuse de faire doublon.

Ce compte crée ensuite ceux des autres bénévoles depuis
**/admin → Comptes bénévoles**.

> Ce compte se crée depuis le site, jamais depuis l’interface Supabase : le
> mot de passe est haché par scrypt avant d’atteindre la base et n’existe en
> clair nulle part. Il n’y a rien à saisir côté Supabase.

### Sauvegardes

Supabase sauvegarde quotidiennement (**Database → Backups**). Pour une copie
locale, `pg_dump` sur l’adresse de connexion directe suffit.


---

## 5. WordPress headless (contenus)

Le WordPress reste consommé en lecture le temps de la transition : les
articles publiés depuis `/admin` sont prioritaires, ceux du WordPress
complètent la liste. Le site le consomme via l’API REST (`/wp-json/wp/v2`), avec
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

**Tout le courant se fait depuis `/admin`** (voir la section « Espace
bénévoles »). Les fichiers ci-dessous ne servent plus que de **contenu de
repli**, affiché tant que la rubrique correspondante est vide dans l’admin :

- `src/content/announcements.ts` — annonces d’origine ;
- `src/content/activities.ts` — activités d’origine ;
- `src/content/services.ts` — services d’origine ;
- `src/config/registrations.ts` — statuts d’inscription d’origine ;
- `src/config/site.ts` — coordonnées, adresse, liens de don, Jumu‘a : valeurs
  de repli des « Réglages du site ».

Reste côté code :

- **Photos livrées avec le site** : `public/media` — la photographie de
  façade, le zellige de fond et les photographies rapatriées du WordPress.
  Elles sont servies par le site lui-même : plus aucune dépendance
  d’affichage au WordPress. Pour rapatrier une photo mise à jour côté
  WordPress, relancez `npm run media:download` ;
- **Textes des pages légales** : `src/app/(site)/mentions-legales` et
  `src/app/(site)/politique-confidentialite`.

---

## ✅ À valider par l’association (TODO humains)

Ces points sont **volontairement centralisés** et marqués `TODO` dans le code :

1. **Adresse** — le site actuel affiche à la fois « 1 rue **Lamartine** »
   (lien Google Maps) et « 1 rue **Larmartine** » (texte). Le nouveau site
   utilise « Lamartine » partout via `src/config/site.ts` : **confirmer
   l’orthographe officielle** et corriger à un seul endroit si besoin.
2. **Jumu‘a** — 13 h 15 est l’horaire annoncé sur MAWAQIT ; vérifier s’il
   varie selon la saison (réglable dans `/admin` → Réglages du site).
3. **Statuts d’inscription** — ajuster à chaque rentrée depuis
   `/admin` → Inscriptions.
4. **Services** — faire relire la liste depuis `/admin` → Services.
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
