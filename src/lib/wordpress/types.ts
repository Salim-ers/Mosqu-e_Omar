/** Types bruts de l'API REST WordPress (sous-ensemble utilisé). */

export type WpRendered = { rendered: string };

export type WpFeaturedMedia = {
  source_url?: string;
  alt_text?: string;
  media_details?: { width?: number; height?: number };
};

export type WpPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  title: WpRendered;
  excerpt?: WpRendered;
  content?: WpRendered;
  categories?: number[];
  _embedded?: { "wp:featuredmedia"?: WpFeaturedMedia[] };
};

export type WpPage = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  title: WpRendered;
  content?: WpRendered;
};

export type WpCategory = {
  id: number;
  slug: string;
  name: string;
  count: number;
};

/** Modèle interne, propre, consommé par l'interface. */
export type Post = {
  id: number;
  slug: string;
  title: string;
  dateISO: string;
  modifiedISO: string;
  excerpt: string;
  contentHtml: string;
  cover: { url: string; alt: string; width?: number; height?: number } | null;
};

export type Page = {
  id: number;
  slug: string;
  title: string;
  modifiedISO: string;
  contentHtml: string;
};
