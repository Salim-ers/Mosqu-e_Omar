import "server-only";

import { REGISTRATIONS } from "@/config/registrations";
import { site } from "@/config/site";
import { ACTIVITIES } from "@/content/activities";
import { SERVICES } from "@/content/services";
import { GALLERY, PHOTOS, src } from "@/lib/media";
import { richTextExcerpt, richTextToHtml } from "@/lib/richtext";
import { DEFAULT_REGLAGES, readCollection, readReglages } from "@/lib/store";
import type {
  AlbumRecord,
  EvenementKind,
  ImageRef,
  InscriptionStatus,
  JanazaRecord,
} from "@/lib/store/types";

/**
 * ============================================================================
 * LECTURE DES CONTENUS POUR LE SITE PUBLIC
 * ----------------------------------------------------------------------------
 * Couche unique entre les pages et le stockage. Règle générale : tant qu'une
 * rubrique n'a pas été reprise en main depuis /admin, le site continue
 * d'afficher les contenus d'origine livrés avec le code. Dès qu'un bénévole y
 * publie quelque chose, ce sont ses contenus qui font foi.
 * ============================================================================
 */

export type PublicImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

function toPublicImage(
  image: ImageRef | null | undefined,
  fallbackAlt: string,
): PublicImage | null {
  if (!image?.url) return null;
  return {
    url: image.url,
    alt: image.alt?.trim() || fallbackAlt,
    width: image.width ?? 1600,
    height: image.height ?? 1200,
  };
}

function published<T extends { published: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.published);
}

function byOrder<T extends { order?: number; createdAt: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

/* --------------------------------------------------------- actualités --- */

export type PublicArticle = {
  slug: string;
  title: string;
  excerpt: string;
  dateISO: string;
  cover: PublicImage | null;
  contentHtml: string;
};

export async function getSiteArticles(): Promise<PublicArticle[]> {
  const records = published(await readCollection("actualites"));
  return records
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((record) => ({
      slug: record.slug,
      title: record.title,
      excerpt: record.excerpt.trim() || richTextExcerpt(record.body),
      dateISO: record.publishedAt,
      cover: toPublicImage(record.cover, `Illustration — ${record.title}`),
      contentHtml: richTextToHtml(record.body),
    }));
}

export async function getSiteArticle(
  slug: string,
): Promise<PublicArticle | null> {
  return (await getSiteArticles()).find((a) => a.slug === slug) ?? null;
}

/* ------------------------------------------------------------- janaza --- */

export type PublicJanaza = {
  id: string;
  name: string;
  prayerAt: string;
  place: string;
  burialPlace: string;
  note: string;
};

/** Une annonce de janaza reste visible `hideAfterDays` jours après la prière. */
export function isJanazaVisible(record: JanazaRecord, now = new Date()): boolean {
  const prayer = new Date(record.prayerAt).getTime();
  if (Number.isNaN(prayer)) return false;
  const days = record.hideAfterDays > 0 ? record.hideAfterDays : 7;
  return now.getTime() <= prayer + days * 24 * 60 * 60 * 1000;
}

export async function getJanaza(now = new Date()): Promise<PublicJanaza[]> {
  const records = published(await readCollection("janaza"));
  return records
    .filter((record) => isJanazaVisible(record, now))
    .sort((a, b) => a.prayerAt.localeCompare(b.prayerAt))
    .map((record) => ({
      id: record.id,
      name: record.name,
      prayerAt: record.prayerAt,
      place: record.place,
      burialPlace: record.burialPlace,
      note: record.note,
    }));
}

/* --------------------------------------------------------- événements --- */

export type PublicEvent = {
  id: string;
  title: string;
  kind: EvenementKind;
  startsAt: string;
  endsAt: string;
  timeLabel: string;
  place: string;
  description: string;
  image: PublicImage | null;
  href: string;
  hrefLabel: string;
  isHighlighted: boolean;
};

/** Un événement reste « à venir » jusqu'à la fin de sa journée. */
function eventEnd(startsAt: string, endsAt: string): number {
  const reference = new Date(endsAt || startsAt);
  if (Number.isNaN(reference.getTime())) return 0;
  reference.setHours(23, 59, 59, 999);
  return reference.getTime();
}

export async function getEvents(now = new Date()): Promise<{
  upcoming: PublicEvent[];
  past: PublicEvent[];
}> {
  const records = published(await readCollection("evenements")).map((record) => ({
    id: record.id,
    title: record.title,
    kind: record.kind,
    startsAt: record.startsAt,
    endsAt: record.endsAt,
    timeLabel: record.timeLabel,
    place: record.place,
    description: record.description,
    image: toPublicImage(record.image, `Affiche — ${record.title}`),
    href: record.href,
    hrefLabel: record.hrefLabel,
    isHighlighted: record.isHighlighted,
  }));

  const upcoming = records
    .filter((e) => eventEnd(e.startsAt, e.endsAt) >= now.getTime())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const past = records
    .filter((e) => eventEnd(e.startsAt, e.endsAt) < now.getTime())
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));

  return { upcoming, past };
}

/* ---------------------------------------------------------- activités --- */

export type PublicActivity = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  points: string[];
  detail: string;
  audience: string;
  image: PublicImage;
};

const STATIC_ACTIVITIES: PublicActivity[] = ACTIVITIES.map((activity) => {
  const photo = PHOTOS[activity.photo];
  return {
    slug: activity.slug,
    title: activity.title,
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

export async function getActivities(): Promise<PublicActivity[]> {
  const records = byOrder(published(await readCollection("activites")));
  if (records.length === 0) return STATIC_ACTIVITIES;

  const fallbackPhoto = PHOTOS.galerie1;
  return records.map((record) => ({
    slug: record.slug,
    title: record.title,
    kicker: record.kicker,
    summary: record.summary,
    points: record.points,
    detail: record.detail,
    audience: record.audience,
    image:
      toPublicImage(record.image, `${record.title} — Mosquée Omar, Creil`) ?? {
        url: src(fallbackPhoto),
        alt: fallbackPhoto.alt,
        width: fallbackPhoto.width,
        height: fallbackPhoto.height,
      },
  }));
}

export async function getActivity(
  slug: string,
): Promise<PublicActivity | null> {
  return (await getActivities()).find((a) => a.slug === slug) ?? null;
}

/* ----------------------------------------------------------- services --- */

export type PublicService = { label: string; note: string };

export async function getServices(): Promise<PublicService[]> {
  const records = byOrder(published(await readCollection("services")));
  if (records.length === 0) return SERVICES.map((s) => ({ ...s }));
  return records.map((record) => ({ label: record.label, note: record.note }));
}

/* ------------------------------------------------------- inscriptions --- */

export type PublicInscription = {
  label: string;
  status: InscriptionStatus;
  note: string;
};

export async function getInscriptions(): Promise<PublicInscription[]> {
  const records = byOrder(published(await readCollection("inscriptions")));
  if (records.length === 0) {
    return Object.values(REGISTRATIONS).map((entry) => ({
      label: entry.label,
      status: entry.status,
      note: entry.note ?? "",
    }));
  }
  return records.map((record) => ({
    label: record.label,
    status: record.status,
    note: record.note,
  }));
}

/* ------------------------------------------------------------ galerie --- */

export type PublicAlbum = {
  id: string;
  title: string;
  date: string;
  description: string;
  photos: PublicImage[];
};

function albumPhotos(record: AlbumRecord): PublicImage[] {
  return record.photos
    .map((photo, index) =>
      toPublicImage(photo, `${record.title} — photographie ${index + 1}`),
    )
    .filter((photo): photo is PublicImage => photo !== null);
}

export async function getAlbums(): Promise<PublicAlbum[]> {
  const records = byOrder(published(await readCollection("albums")));
  return records
    .map((record) => ({
      id: record.id,
      title: record.title,
      date: record.date,
      description: record.description,
      photos: albumPhotos(record),
    }))
    .filter((album) => album.photos.length > 0);
}

/** Les photographies d'origine du site, toujours présentes en fin de galerie. */
export const HERITAGE_PHOTOS: PublicImage[] = GALLERY.map((photo) => ({
  url: src(photo),
  alt: photo.alt,
  width: photo.width,
  height: photo.height,
}));

/* ---------------------------------------------------------- réglages --- */

export type EffectiveSettings = {
  jumua: string | null;
  banner: { text: string; href: string } | null;
  phone: string;
  phoneHref: string;
  email: string;
  address: { street: string; postalCode: string; city: string };
  donationUrl: string;
  monthlyDonationUrl: string;
  socials: { label: string; href: string }[];
};

/** Réglages saisis dans l'admin, complétés par la configuration du code. */
export async function getSettings(): Promise<EffectiveSettings> {
  const stored = await readReglages().catch(() => DEFAULT_REGLAGES);
  const phone = stored.contactPhone.trim() || site.contact.phone;

  return {
    jumua: stored.updatedAt
      ? stored.jumua.trim() || null
      : (site.mawaqit.jumua ?? null),
    banner:
      stored.bannerActive && stored.bannerText.trim()
        ? { text: stored.bannerText.trim(), href: stored.bannerHref.trim() }
        : null,
    phone,
    phoneHref: `tel:${phone.replace(/[^+0-9]/g, "")}`,
    email: stored.contactEmail.trim() || site.contact.email,
    address: {
      street: stored.addressStreet.trim() || site.address.street,
      postalCode: stored.addressPostalCode.trim() || site.address.postalCode,
      city: stored.addressCity.trim() || site.address.city,
    },
    donationUrl: stored.donationUrl.trim() || site.donation.onlineUrl,
    monthlyDonationUrl:
      stored.monthlyDonationUrl.trim() || site.donation.monthlyUrl,
    socials: stored.socials.length > 0 ? stored.socials : [...site.socials],
  };
}
