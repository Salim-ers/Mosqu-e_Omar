import { ActivitiesSection } from "@/components/activities/ActivitiesSection";
import { AnnouncementsSection } from "@/components/announcements/AnnouncementsSection";
import { DonationSection } from "@/components/donation/DonationSection";
import { GalleryPreviewSection } from "@/components/gallery/GalleryPreviewSection";
import { LocationSection } from "@/components/location/LocationSection";
import { PrayerSection } from "@/components/prayer/PrayerSection";
import { AssociationSection } from "@/components/sections/AssociationSection";
import { HomeHero } from "@/components/sections/HomeHero";
import { NewMosqueSection } from "@/components/sections/NewMosqueSection";
import { ServicesSection } from "@/components/sections/ServicesSection";

/**
 * Page d'accueil — narration en 11 temps :
 * 01 Hero · 02 Horaires · 03 Annonces · 04 Nouvelle mosquée · 05 Activités ·
 * 06 Galerie · 07 Association · 08 Services · 09 Don · 10 Localisation ·
 * 11 Footer (layout).
 */
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PrayerSection number="02" />
      <AnnouncementsSection number="03" />
      <NewMosqueSection number="04" />
      <ActivitiesSection number="05" />
      <GalleryPreviewSection number="06" />
      <AssociationSection number="07" />
      <ServicesSection number="08" />
      <DonationSection number="09" />
      <LocationSection number="10" />
    </>
  );
}
