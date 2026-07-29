import type { PhotoKey } from "@/lib/media";

/**
 * Activités de la mosquée — contenus repris et mis au propre depuis la page
 * d'accueil actuelle (les descriptions sont celles publiées par la mosquée).
 * NB : sur le site actuel, la carte « Vie communautaire » dupliquait par
 * erreur le texte du soutien scolaire ; elle a été réécrite ici à partir des
 * services confirmés (Salat Al-Aïd, iftars du Ramadan, événements).
 */

export type Activity = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  points: string[];
  detail: string;
  audience: string;
  photo: PhotoKey;
  registrationKey?: "coran" | "arabe" | "soutien";
};

export const ACTIVITIES: Activity[] = [
  {
    slug: "cours-de-coran",
    title: "Cours de Coran",
    kicker: "Apprentissage & mémorisation",
    summary:
      "Des cours d’apprentissage et de mémorisation du Saint Coran, destinés aux enfants, aux adolescents et aux adultes.",
    points: [
      "Lecture correcte du Coran selon les règles du tajwid",
      "Mémorisation progressive des sourates",
      "Révision et perfectionnement de la récitation",
    ],
    detail:
      "L’objectif est de permettre à chacun de se rapprocher du Livre d’Allah et de renforcer sa pratique religieuse dans un cadre pédagogique et bienveillant.",
    audience: "Enfants · Adolescents · Adultes",
    photo: "activiteCoran",
    registrationKey: "coran",
  },
  {
    slug: "dourous",
    title: "Dourous",
    kicker: "Enseignements religieux",
    summary:
      "Des cours et rappels religieux régulièrement organisés à la mosquée afin d’approfondir les connaissances religieuses.",
    points: [
      "Les fondements de la foi (‘aqîda)",
      "La jurisprudence islamique (fiqh)",
      "La vie et les enseignements du Prophète ﷺ",
      "L’éthique et les valeurs morales en Islam",
    ],
    detail:
      "Ces enseignements sont ouverts à tous et visent à renforcer la compréhension et la pratique de la religion au quotidien.",
    audience: "Ouvert à toutes et à tous",
    photo: "activiteDourous",
  },
  {
    slug: "cours-de-langue-arabe",
    title: "Cours de langue arabe",
    kicker: "Lecture, écriture, compréhension",
    summary:
      "Des cours de langue arabe adaptés à différents niveaux, du débutant au perfectionnement.",
    points: [
      "L’alphabet arabe",
      "La lecture et l’écriture",
      "Les bases de la compréhension de la langue",
    ],
    detail:
      "Ces cours facilitent notamment l’apprentissage du Coran et l’accès aux textes religieux.",
    audience: "Tous niveaux",
    photo: "activiteArabe",
    registrationKey: "arabe",
  },
  {
    slug: "soutien-scolaire",
    title: "Soutien scolaire",
    kicker: "Engagement éducatif",
    summary:
      "Un accompagnement scolaire destiné aux élèves du primaire et du collège, dans un environnement structurant et positif.",
    points: [
      "Aide aux devoirs",
      "Renforcement dans les matières principales",
      "Apprentissage de méthodes de travail efficaces",
    ],
    detail:
      "Ce dispositif vise à accompagner les jeunes dans leur parcours et à favoriser leur réussite scolaire.",
    audience: "Primaire · Collège",
    photo: "activiteSoutien",
    registrationKey: "soutien",
  },
  {
    slug: "vie-communautaire",
    title: "Vie communautaire & événements",
    kicker: "Fraternité & partage",
    summary:
      "La mosquée est un lieu de rassemblement : grandes prières, moments de partage et événements rythment la vie de la communauté.",
    points: [
      "Prière du vendredi (Jumu‘a) et Salat Al-Aïd",
      "Iftars pendant le mois de Ramadan",
      "Rencontres, conférences et événements de la communauté",
    ],
    detail:
      "Ces moments renforcent le lien social, la solidarité et le vivre-ensemble que porte l’association ACCMPR depuis 2013.",
    audience: "Toute la communauté",
    photo: "activiteCommunaute",
  },
];

export function getActivity(slug: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.slug === slug);
}
