"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/** Coordonnées effectives, transmises par le bandeau (réglables dans /admin). */
export type MenuContact = {
  phone: string;
  phoneHref: string;
  address: string;
};

/**
 * Menu plein écran : charbon profond, grands liens en Cormorant, apparition
 * en cascade (transitions CSS uniquement — pas de librairie pour un simple
 * panneau). Verrouillage du scroll, fermeture à Échap, focus géré.
 */
export function MobileMenu({
  open,
  onClose,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  contact: MenuContact;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  const links = [...site.navigation.main, ...site.navigation.secondary];

  return (
    <div
      id="menu-mobile"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className={cn(
        "on-dark fixed inset-0 z-[90] flex flex-col bg-ink text-ivory transition-[opacity,visibility] duration-500 motion-reduce:transition-none",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <div aria-hidden className="pattern-zellige absolute inset-0" />

      <div className="relative flex h-[4.5rem] items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
        <p className="font-display text-lg font-medium tracking-wide">
          Mosquée Omar Ibn al Khattab
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center text-ivory"
        >
          <span className="sr-only">Fermer le menu</span>
          <span aria-hidden className="relative block h-6 w-6">
            <span className="absolute top-1/2 left-0 h-px w-6 -translate-y-1/2 rotate-45 bg-current" />
            <span className="absolute top-1/2 left-0 h-px w-6 -translate-y-1/2 -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <nav
        aria-label="Menu"
        className="relative flex-1 overflow-y-auto px-5 pt-6 pb-10 sm:px-8 lg:px-12"
      >
        <ul className="space-y-1">
          {links.map((link, index) => (
            <li
              key={link.href}
              style={{ transitionDelay: open ? `${90 + index * 45}ms` : "0ms" }}
              className={cn(
                "border-b border-ivory/10 transition-[opacity,transform] duration-500 motion-reduce:transition-none",
                open
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0",
              )}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className="group flex items-baseline justify-between py-4"
              >
                <span className="font-display text-[2rem] leading-none font-medium sm:text-4xl">
                  {link.label}
                </span>
                <span
                  aria-hidden
                  className="text-[0.65rem] tracking-[0.3em] text-ivory/35 uppercase transition-colors group-hover:text-ivory/80"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative border-t border-ivory/10 px-5 py-6 text-[0.8rem] leading-relaxed text-ivory/60 sm:px-8 lg:px-12">
        <p className="font-arabic text-lg text-ivory/70" lang="ar" dir="rtl">
          {site.arabicName}
        </p>
        <p className="mt-2">{contact.address}</p>
        <p className="mt-1">
          <a href={contact.phoneHref} className="link-editorial">
            {contact.phone}
          </a>
          {" · "}
          <a
            href={site.mawaqit.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-editorial"
          >
            Horaires sur MAWAQIT
          </a>
        </p>
      </div>
    </div>
  );
}
