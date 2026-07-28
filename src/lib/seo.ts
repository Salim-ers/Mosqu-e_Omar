import { fullAddress, site } from "@/config/site";
import { PHOTOS } from "@/lib/media";

/** Générateurs JSON-LD (schema.org) — Mosque, Organization, Event. */

export function mosqueJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Mosque",
    name: `${site.name} — ${site.address.city}`,
    alternateName: site.arabicName,
    url: site.url,
    telephone: "+33 3 44 24 82 11",
    email: site.contact.email,
    image: [PHOTOS.facade.remote],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    isAccessibleForFree: true,
    publicAccess: true,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.association.acronym,
    legalName: `${site.association.acronym} — ${site.association.description}`,
    url: site.url,
    email: site.contact.email,
    telephone: "+33 3 44 24 82 11",
    foundingDate: String(site.association.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    identifier: { "@type": "PropertyValue", name: "SIRET", value: site.association.siret },
  };
}

export function eventJsonLd(event: {
  name: string;
  startDate: string;
  description?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.startDate,
    description: event.description,
    url: event.url,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: site.longName,
      address: fullAddress(),
    },
    organizer: { "@type": "Organization", name: site.association.acronym },
  };
}
