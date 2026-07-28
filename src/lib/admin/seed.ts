import "server-only";

import { REGISTRATIONS } from "@/config/registrations";
import { ACTIVITIES } from "@/content/activities";
import { LOCAL_ANNOUNCEMENTS } from "@/content/announcements";
import { SERVICES } from "@/content/services";
import { PHOTOS, src } from "@/lib/media";
import { newId, readCollection, writeCollection } from "@/lib/store";
import type {
  ActiviteRecord,
  AnnonceRecord,
  InscriptionRecord,
  ServiceRecord,
} from "@/lib/store/types";

/**
 * Reprise en main des contenus livrés avec le code : copie les activités,
 * services, inscriptions et annonces d'origine dans l'espace bénévoles, pour
 * que l'association puisse les modifier au lieu de tout ressaisir.
 * N'écrase jamais une rubrique déjà remplie.
 */
export async function importStaticContent(): Promise<string[]> {
  const done: string[] = [];
  const now = new Date().toISOString();

  const base = (index: number) => ({
    id: newId(),
    createdAt: now,
    updatedAt: now,
    published: true,
    order: index,
  });

  if ((await readCollection("activites")).length === 0) {
    const records: ActiviteRecord[] = ACTIVITIES.map((activity, index) => {
      const photo = PHOTOS[activity.photo];
      return {
        ...base(index),
        title: activity.title,
        slug: activity.slug,
        kicker: activity.kicker,
        summary: activity.summary,
        points: [...activity.points],
        detail: activity.detail,
        audience: activity.audience,
        image: {
          url: src(photo),
          alt: photo.alt,
          width: photo.width,
          height: photo.height,
        },
      };
    });
    await writeCollection("activites", records);
    done.push(`${records.length} activités`);
  }

  if ((await readCollection("services")).length === 0) {
    const records: ServiceRecord[] = SERVICES.map((service, index) => ({
      ...base(index),
      label: service.label,
      note: service.note,
    }));
    await writeCollection("services", records);
    done.push(`${records.length} services`);
  }

  if ((await readCollection("inscriptions")).length === 0) {
    const records: InscriptionRecord[] = Object.values(REGISTRATIONS).map(
      (entry, index) => ({
        ...base(index),
        label: entry.label,
        status: entry.status,
        note: entry.note ?? "",
      }),
    );
    await writeCollection("inscriptions", records);
    done.push(`${records.length} lignes d’inscription`);
  }

  if ((await readCollection("annonces")).length === 0) {
    const records: AnnonceRecord[] = LOCAL_ANNOUNCEMENTS.map(
      (announcement, index) => ({
        ...base(index),
        title: announcement.title,
        body: announcement.body ?? "",
        href: announcement.href ?? "",
        hrefLabel: announcement.hrefLabel ?? "",
        publishedAt: announcement.publishedAt.slice(0, 10),
        startsAt: announcement.startsAt?.slice(0, 10) ?? "",
        endsAt: announcement.endsAt?.slice(0, 10) ?? "",
        isPinned: announcement.isPinned ?? false,
      }),
    );
    await writeCollection("annonces", records);
    done.push(`${records.length} annonces`);
  }

  return done;
}
