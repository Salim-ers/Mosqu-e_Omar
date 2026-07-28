/**
 * Services de la mosquée — liste fournie par l'association comme confirmée.
 * TODO (validation humaine) : faire relire cette liste avant mise en ligne ;
 * retirer ici toute prestation qui ne serait plus assurée.
 */
export type Service = { label: string; note: string };

export const SERVICES: Service[] = [
  { label: "Espace femmes", note: "Salle de prière dédiée aux sœurs" },
  { label: "Salle d’ablutions", note: "Espaces d’ablutions hommes et femmes" },
  { label: "Cours pour adultes", note: "Coran, arabe et enseignements religieux" },
  { label: "Cours pour enfants", note: "Coran, arabe et soutien scolaire" },
  { label: "Accès PMR", note: "Accès facilité aux personnes à mobilité réduite" },
  { label: "Salat Janaza", note: "Prière funéraire — contacter la mosquée" },
  { label: "Salat Al-Aïd", note: "Grandes prières de l’Aïd" },
  { label: "Iftar du Ramadan", note: "Repas de rupture du jeûne pendant le Ramadan" },
  { label: "Parking", note: "Stationnement à proximité (aménagements en cours)" },
];
