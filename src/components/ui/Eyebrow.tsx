import { cn } from "@/lib/utils";

/**
 * Surtitre éditorial : numéro de chapitre + filet + libellé.
 * La numérotation encode la narration séquencée de la page d'accueil
 * (structure 01 → 11 exigée par le cahier des charges). Sur fond clair, le
 * numéro est serti dans un petit carré d'encre : la touche de noir qui ponctue
 * chaque section du site.
 */
export function Eyebrow({
  number,
  children,
  className,
  onDark = false,
}: {
  number?: string;
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-4 text-[0.68rem] font-semibold tracking-[0.28em] uppercase",
        onDark ? "text-ivory/85" : "text-charcoal/70",
        className,
      )}
    >
      {number ? (
        <span
          className={cn(
            "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] font-display text-[0.8rem] italic tracking-normal",
            onDark
              ? "border border-ivory/25 text-ivory/92"
              : "bg-ink text-ivory",
          )}
        >
          {number}
        </span>
      ) : null}
      <span
        aria-hidden
        className={cn("h-px w-10", onDark ? "bg-ivory/25" : "bg-charcoal/25")}
      />
      <span>{children}</span>
    </p>
  );
}
