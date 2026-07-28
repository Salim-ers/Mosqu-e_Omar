/**
 * ============================================================================
 * STATUT DES INSCRIPTIONS — à maintenir par l'association.
 * ----------------------------------------------------------------------------
 * TODO (validation humaine) : ajuster ces statuts à chaque rentrée / session.
 *  – OPEN        → « Inscriptions ouvertes » (le contact se fait auprès de la
 *                  mosquée : téléphone, email ou sur place) ;
 *  – COMING_SOON → « Ouverture prochaine » (avec note libre) ;
 *  – CLOSED      → « Inscriptions closes pour cette session ».
 * ============================================================================
 */

export type RegistrationStatus = "OPEN" | "COMING_SOON" | "CLOSED";

export type RegistrationEntry = {
  label: string;
  status: RegistrationStatus;
  note?: string;
};

export const REGISTRATIONS: Record<
  "coran" | "arabe" | "soutien",
  RegistrationEntry
> = {
  coran: {
    label: "Cours de Coran",
    status: "OPEN",
    note: "Enfants, adolescents et adultes — renseignements auprès de la mosquée.",
  },
  arabe: {
    label: "Cours de langue arabe",
    status: "OPEN",
    note: "Tous niveaux — renseignements auprès de la mosquée.",
  },
  soutien: {
    label: "Soutien scolaire",
    status: "OPEN",
    note: "Élèves du primaire et du collège.",
  },
};

export const REGISTRATION_LABELS: Record<
  RegistrationStatus,
  { label: string; toneClass: string }
> = {
  OPEN: { label: "Inscriptions ouvertes", toneClass: "text-olive" },
  COMING_SOON: { label: "Ouverture prochaine", toneClass: "text-amber" },
  CLOSED: { label: "Inscriptions closes", toneClass: "text-taupe" },
};
