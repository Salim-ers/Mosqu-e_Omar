import Link from "next/link";

import { BUTTON_STYLES } from "@/components/admin/inputStyles";
import { cn } from "@/lib/utils";

/**
 * Briques visuelles de l'espace bénévoles. Même vocabulaire que le site
 * public (encre, ivoire, Cormorant) mais densité d'outil de travail :
 * lisible, dépouillé, sans surprise.
 */

export function AdminPageTitle({
  eyebrow,
  title,
  lead,
  actions,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-charcoal/12 pb-7">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-[0.62rem] font-semibold tracking-[0.28em] text-charcoal/45 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 font-display text-4xl leading-tight font-medium text-charcoal">
          {title}
        </h1>
        {lead ? (
          <p className="mt-3 text-[0.92rem] leading-relaxed text-charcoal/60">
            {lead}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function AdminLink({
  href,
  variant = "ghost",
  className,
  children,
}: {
  href: string;
  variant?: keyof typeof BUTTON_STYLES;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(BUTTON_STYLES[variant], className)}>
      {children}
    </Link>
  );
}

export function Panel({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[3px] border border-charcoal/12 bg-cream p-6 sm:p-8",
        className,
      )}
    >
      {title ? (
        <h2 className="font-display text-2xl font-medium text-charcoal">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-charcoal/60">
          {description}
        </p>
      ) : null}
      <div className={title || description ? "mt-6" : undefined}>{children}</div>
    </section>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "error";
  children: React.ReactNode;
}) {
  const tones = {
    info: "border-charcoal/15 bg-cream text-charcoal/75",
    success: "border-[#46503c]/30 bg-[#46503c]/8 text-[#3a4232]",
    error: "border-[#8a2a20]/25 bg-[#8a2a20]/6 text-[#8a2a20]",
  } as const;

  return (
    <p
      role="status"
      className={cn(
        "rounded-[2px] border px-4 py-3 text-[0.86rem] leading-relaxed",
        tones[tone],
      )}
    >
      {children}
    </p>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[3px] border border-dashed border-charcoal/20 px-8 py-14 text-center">
      <p className="font-display text-2xl font-medium text-charcoal">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-[0.9rem] leading-relaxed text-charcoal/60">
        {description}
      </p>
      {action ? <div className="mt-7 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function StatusPill({
  published,
  labels = ["En ligne", "Brouillon"],
}: {
  published: boolean;
  labels?: [string, string];
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[2px] px-2.5 py-1 text-[0.58rem] font-semibold tracking-[0.2em] uppercase",
        published
          ? "bg-ink text-ivory"
          : "border border-charcoal/20 text-charcoal/50",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rotate-45",
          published ? "bg-amber" : "bg-charcoal/30",
        )}
      />
      {published ? labels[0] : labels[1]}
    </span>
  );
}
