import { cn } from "@/lib/utils";

/**
 * Surtitre éditorial : numéro de chapitre + filet + libellé.
 * La numérotation encode la narration séquencée de la page d'accueil
 * (structure 01 → 11 exigée par le cahier des charges).
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
        "flex items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em]",
        onDark ? "text-ivory/60" : "text-taupe",
        className,
      )}
    >
      {number ? (
        <span className={cn("font-display text-sm italic tracking-normal", onDark ? "text-ivory/70" : "text-beige")}>
          {number}
        </span>
      ) : null}
      <span
        aria-hidden
        className={cn("h-px w-10", onDark ? "bg-ivory/25" : "bg-beige")}
      />
      <span>{children}</span>
    </p>
  );
}
