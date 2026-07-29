import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

export function SectionHeading({
  number,
  eyebrow,
  title,
  lead,
  onDark = false,
  className,
  align = "left",
}: {
  number?: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  onDark?: boolean;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <header
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Eyebrow
        number={number}
        onDark={onDark}
        className={cn(align === "center" && "justify-center")}
      >
        {eyebrow}
      </Eyebrow>
      <h2
        className={cn(
          "mt-6 font-display text-[3rem] leading-[1.02] font-medium tracking-[-0.015em] sm:text-6xl lg:text-7xl",
          onDark ? "text-ivory" : "text-charcoal",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mt-6 text-[1.02rem] leading-[1.85]",
            onDark ? "text-ivory/90" : "text-charcoal/70",
          )}
        >
          {lead}
        </p>
      ) : null}
    </header>
  );
}
