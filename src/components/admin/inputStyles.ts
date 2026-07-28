/** Styles partagés des champs et boutons de l'espace bénévoles. */

export const INPUT_CLASS =
  "w-full rounded-[2px] border border-charcoal/20 bg-ivory px-3.5 py-2.5 text-[0.95rem] text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-charcoal";

export const LABEL_CLASS =
  "block text-[0.66rem] font-semibold tracking-[0.2em] text-charcoal/55 uppercase";

export const HELP_CLASS = "mt-2 text-[0.8rem] leading-relaxed text-charcoal/50";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-[2px] border px-5 py-2.5 text-[0.7rem] font-semibold tracking-[0.16em] uppercase transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export const BUTTON_STYLES = {
  primary: `${BUTTON_BASE} border-ink bg-ink text-ivory hover:bg-charcoal`,
  ghost: `${BUTTON_BASE} border-charcoal/20 bg-transparent text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory`,
  /** Sur fond sombre (page de connexion). */
  light: `${BUTTON_BASE} border-ivory bg-ivory text-ink hover:bg-transparent hover:text-ivory`,
  danger: `${BUTTON_BASE} border-transparent bg-transparent text-charcoal/50 hover:text-[#8a2a20]`,
} as const;

export type ButtonVariant = keyof typeof BUTTON_STYLES;
