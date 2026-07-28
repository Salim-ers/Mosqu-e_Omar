import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Boutons de la maison : rectangulaires, typographie espacée, remplissage au
 * survol. Aucune pilule, aucun dégradé — sobriété institutionnelle.
 */

type Variant = "primary" | "outline" | "onImage" | "onDark" | "inverse";

const BASE =
  "group inline-flex items-center justify-center gap-3 rounded-[2px] border px-7 py-[0.95rem] text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 motion-reduce:transition-none";

const VARIANTS: Record<Variant, string> = {
  primary:
    "border-charcoal bg-charcoal text-ivory hover:bg-ink hover:border-ink",
  outline:
    "border-charcoal/25 bg-transparent text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory",
  onImage:
    "on-dark border-ivory/40 bg-transparent text-ivory hover:bg-ivory hover:text-charcoal hover:border-ivory",
  onDark:
    "on-dark border-ivory/25 bg-transparent text-ivory/90 hover:border-ivory hover:bg-ivory hover:text-charcoal",
  inverse:
    "border-ivory bg-ivory text-charcoal hover:bg-transparent hover:text-ivory",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  external = false,
  variant = "primary",
  className,
  children,
  ...rest
}: CommonProps & {
  href: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  const classes = cn(BASE, VARIANTS[variant], className);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(BASE, VARIANTS[variant], className)} {...rest}>
      {children}
    </button>
  );
}
