#!/usr/bin/env node
/**
 * Rapatrie les photographies et le logo depuis le WordPress actuel vers
 * /public/media, afin de servir les images depuis le nouveau site
 * (recommandé en production : NEXT_PUBLIC_USE_LOCAL_MEDIA=true).
 *
 * Stratégie : pour chaque visuel, on tente d'abord le fichier ORIGINAL
 * pleine résolution (URL sans suffixe -WxH), puis on se replie sur la
 * variante dimensionnée dont l'existence a été vérifiée lors de l'audit.
 *
 * Usage :  node scripts/download-media.mjs
 *          (ou : npm run media:download)
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const WP = process.env.WORDPRESS_BASE_URL ?? "https://mosqueeomarcreil.fr";
const OUT = path.join(process.cwd(), "public", "media");

/** [nom de fichier local, candidats par ordre de préférence] */
const TARGETS = [
  ["facade.jpeg", ["2026/02/IMG_1068.jpeg"]],
  ["chantier.jpeg", ["2026/02/IMG_1069.jpeg", "2026/02/IMG_1069-1024x663.jpeg"]],
  ["galerie-1.jpeg", ["2026/03/IMG_2690.jpeg", "2026/03/IMG_2690-1024x768.jpeg"]],
  ["galerie-2.jpeg", ["2026/03/IMG_2689.jpeg", "2026/03/IMG_2689-768x1024.jpeg"]],
  [
    "galerie-3.jpeg",
    [
      "2025/12/51d645b5-3bb2-4ccd-a134-78159abcd2e0.jpeg",
      "2025/12/51d645b5-3bb2-4ccd-a134-78159abcd2e0-768x1024.jpeg",
    ],
  ],
  ["galerie-4.jpeg", ["2026/03/IMG_2681.jpeg", "2026/03/IMG_2681-1024x768.jpeg"]],
  ["galerie-5.jpeg", ["2026/03/IMG_3314.jpeg", "2026/03/IMG_3314-768x1024.jpeg"]],
  ["galerie-6.jpeg", ["2025/12/IMG_2372.jpeg", "2025/12/IMG_2372-1024x768.jpeg"]],
  [
    "logo.png",
    [
      "2025/03/IMG_8627-modified.png",
      "2025/03/cropped-IMG_8627-modified.png",
      "2025/03/cropped-cropped-IMG_8627-modified.png",
      "2025/03/cropped-cropped-IMG_8627-modified-300x300.png",
    ],
  ],
];

async function fetchFirst(candidates) {
  for (const candidate of candidates) {
    const url = `${WP}/wp-content/uploads/${candidate}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.byteLength > 1_000) return { url, buffer };
      }
    } catch {
      // On tente le candidat suivant.
    }
  }
  return null;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  let ok = 0;
  let ko = 0;

  for (const [filename, candidates] of TARGETS) {
    const hit = await fetchFirst(candidates);
    if (hit) {
      await writeFile(path.join(OUT, filename), hit.buffer);
      const kb = Math.round(hit.buffer.byteLength / 1024);
      console.log(`✔ ${filename}  ←  ${hit.url}  (${kb} ko)`);
      ok += 1;
    } else {
      console.warn(`✖ ${filename}  —  aucun candidat accessible`);
      ko += 1;
    }
  }

  console.log(`\n${ok} fichier(s) téléchargé(s), ${ko} échec(s).`);
  if (ok > 0) {
    console.log(
      "→ Ajoutez NEXT_PUBLIC_USE_LOCAL_MEDIA=true dans votre .env pour servir ces fichiers localement.",
    );
  }
  if (ko > 0) process.exitCode = 1;
}

main();
