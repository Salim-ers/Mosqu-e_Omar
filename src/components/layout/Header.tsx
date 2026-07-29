"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  MobileMenu,
  type MenuContact,
} from "@/components/layout/MobileMenu";
import { site } from "@/config/site";
import { logoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

/** Pages ouvrant sur une photographie plein écran (header clair au sommet). */
const OVERLAY_ROUTES = new Set(["/", "/projet"]);

const PRIMARY_LINKS = site.navigation.main.filter((l) => l.href !== "/");

/** Bandeau d'information réglé depuis l'espace bénévoles. */
export type HeaderBanner = { text: string; href: string } | null;

export function Header({
  banner = null,
  contact,
}: {
  banner?: HeaderBanner;
  contact: MenuContact;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const overlay = OVERLAY_ROUTES.has(pathname) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Referme le menu à chaque navigation (ajustement d'état pendant le rendu,
  // motif recommandé par React — pas d'effet en cascade).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={cn(
          // Le bandeau de navigation est toujours sombre : transparent sur les
          // pages qui ouvrent sur une photographie, encre pleine partout ailleurs.
          "on-dark fixed inset-x-0 top-0 z-50 text-ivory transition-[background-color,border-color,box-shadow] duration-500 motion-reduce:transition-none",
          overlay
            ? "border-b border-transparent bg-transparent"
            : "border-b border-ivory/10 bg-ink/95 shadow-[0_1px_0_0_rgba(248,245,239,0.06)] backdrop-blur-md",
        )}
      >
        {/* Bandeau d'information : or franc sur texte d'encre. Il sert aux
            annonces exceptionnelles — il doit se voir du premier coup d'œil,
            y compris par-dessus la photographie de l'accueil. */}
        {banner ? (
          <div className="bg-gold text-ink">
            <div className="mx-auto flex w-full max-w-[100rem] items-center justify-center gap-3 px-5 py-3 text-center sm:px-8 lg:px-12">
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 rotate-45 bg-ink" />
              {banner.href ? (
                <Link
                  href={banner.href}
                  className="link-editorial text-[0.74rem] font-semibold tracking-[0.16em] text-ink uppercase"
                >
                  {banner.text}
                </Link>
              ) : (
                <span className="text-[0.74rem] font-semibold tracking-[0.16em] text-ink uppercase">
                  {banner.text}
                </span>
              )}
            </div>
          </div>
        ) : null}

        <div className="mx-auto flex h-[4.5rem] w-full max-w-[100rem] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-12">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3.5"
            aria-label={`${site.longName} — retour à l’accueil`}
          >
            <Image
              src={logoSrc()}
              alt=""
              width={44}
              height={44}
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-ivory/25 lg:h-11 lg:w-11"
            />
            <span className="hidden min-w-0 flex-col leading-tight sm:flex">
              <span className="font-display text-[1.15rem] font-medium tracking-wide">
                Mosquée Omar Ibn al Khattab
              </span>
              <span className="text-[0.62rem] font-semibold tracking-[0.32em] text-ivory/55 uppercase">
                Creil — Oise
              </span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {PRIMARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "link-editorial text-[0.72rem] font-semibold tracking-[0.18em] uppercase",
                      pathname === link.href
                        ? "text-ivory"
                        : "text-ivory/70 hover:text-ivory",
                    )}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dons"
              className={cn(
                "hidden rounded-[2px] border px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-300 motion-reduce:transition-none sm:inline-flex",
                overlay
                  ? "border-ivory/40 text-ivory hover:bg-ivory hover:text-ink"
                  : "border-ivory bg-ivory text-ink hover:bg-transparent hover:text-ivory",
              )}
            >
              Faire un don
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className="inline-flex h-11 w-11 flex-col items-center justify-center gap-[7px] rounded-[2px] text-ivory xl:hidden"
            >
              <span className="sr-only">Ouvrir le menu</span>
              <span aria-hidden className="h-px w-6 bg-current" />
              <span aria-hidden className="h-px w-6 bg-current" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} contact={contact} />
    </>
  );
}
