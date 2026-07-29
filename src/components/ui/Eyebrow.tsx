import { cn } from "@/lib/utils";

/**
 * Surtitre éditorial : filet + libellé.
 *
 * La numérotation des sections a été retirée : elle datait d'une maquette où
 * la page d'accueil se lisait comme un chapitrage, et elle n'apportait plus
 * rien au lecteur. La propriété `number` est conservée pour ne pas casser les
 * appels existants, mais elle n'est plus affichée.
 */
export function Eyebrow({
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
        "flex items-center gap-4 text-[0.72rem] font-semibold tracking-[0.28em] uppercase",
        onDark ? "text-ivory/85" : "text-charcoal/70",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-px w-10", onDark ? "bg-ivory/25" : "bg-charcoal/25")}
      />
      <span>{children}</span>
    </p>
  );
}
