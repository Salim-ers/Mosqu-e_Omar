"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string; hint?: string };
export type NavGroup = { title: string; items: NavItem[] };

/**
 * Navigation de l'espace bénévoles : colonne d'encre à gauche sur grand
 * écran, panneau dépliant sur téléphone — beaucoup de mises à jour se font
 * depuis la mosquée, un téléphone à la main.
 *
 * Les rubriques sont préchargées : la page suivante est déjà en mémoire quand
 * le clic arrive, et l'affichage devient immédiat.
 */
export function AdminNav({
  groups,
  user,
}: {
  groups: NavGroup[];
  user: { name: string; role: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isCurrent = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-b border-ivory/10 px-5 py-4 text-left lg:hidden"
      >
        <span className="text-[0.66rem] font-semibold tracking-[0.24em] text-ivory/70 uppercase">
          Menu
        </span>
        <span aria-hidden className="text-ivory/50">
          {open ? "✕" : "☰"}
        </span>
      </button>

      <nav
        aria-label="Rubriques de l’espace bénévoles"
        className={cn(
          "px-4 pb-8 lg:block lg:px-5 lg:pb-10",
          open ? "block" : "hidden",
        )}
      >
        {groups.map((group) => (
          <div key={group.title} className="mt-7 first:mt-5">
            <p className="px-3 text-[0.58rem] font-semibold tracking-[0.28em] text-ivory/35 uppercase">
              {group.title}
            </p>
            <ul className="mt-3 space-y-0.5">
              {group.items.map((item) => {
                const current = isCurrent(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch
                      onClick={() => setOpen(false)}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "flex items-baseline justify-between gap-3 rounded-[2px] px-3 py-2.5 text-[0.92rem] transition-colors",
                        current
                          ? "bg-ivory/10 text-ivory"
                          : "text-ivory/60 hover:bg-ivory/5 hover:text-ivory",
                      )}
                    >
                      <span>{item.label}</span>
                      {item.hint ? (
                        <span className="shrink-0 text-[0.7rem] text-ivory/35">
                          {item.hint}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <p className="mt-9 border-t border-ivory/10 px-3 pt-5 text-[0.78rem] leading-relaxed text-ivory/45">
          Compte — {user.name}
          <br />
          <span className="text-ivory/30">
            {user.role === "admin" ? "Responsable" : "Éditeur"}
          </span>
        </p>
      </nav>
    </>
  );
}
