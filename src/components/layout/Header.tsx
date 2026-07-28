"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { site } from "@/config/site";
import { logoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

/** Pages ouvrant sur une photographie plein écran (header clair au sommet). */
const OVERLAY_ROUTES = new Set(["/", "/projet"]);

const PRIMARY_LINKS = site.navigation.main.filter((l) => l.href !== "/");

export function Header() {
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
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color,box-shadow] duration-500 motion-reduce:transition-none",
          overlay
            ? "on-dark border-b border-transparent bg-transparent text-ivory"
            : "border-b hairline bg-ivory/92 text-charcoal backdrop-blur-md",
        )}
      >
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
              className={cn(
                "h-10 w-10 shrink-0 rounded-full object-cover lg:h-11 lg:w-11",
                overlay && "ring-1 ring-ivory/30",
              )}
            />
            <span className="hidden min-w-0 flex-col leading-tight sm:flex">
              <span className="font-display text-[1.15rem] font-medium tracking-wide">
                Mosquée Omar Ibn al Khattab
              </span>
              <span
                className={cn(
                  "text-[0.62rem] font-semibold uppercase tracking-[0.32em]",
                  overlay ? "text-ivory/60" : "text-taupe",
                )}
              >
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
                      "link-editorial text-[0.72rem] font-semibold uppercase tracking-[0.18em]",
                      pathname === link.href &&
                        (overlay ? "text-ivory" : "text-charcoal"),
                      pathname !== link.href &&
                        (overlay
                          ? "text-ivory/75 hover:text-ivory"
                          : "text-charcoal/65 hover:text-charcoal"),
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
                "hidden rounded-[2px] border px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 sm:inline-flex motion-reduce:transition-none",
                overlay
                  ? "border-ivory/40 text-ivory hover:bg-ivory hover:text-charcoal"
                  : "border-charcoal bg-charcoal text-ivory hover:bg-ink",
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
              className={cn(
                "inline-flex h-11 w-11 flex-col items-center justify-center gap-[7px] rounded-[2px] xl:hidden",
                overlay ? "text-ivory" : "text-charcoal",
              )}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <span aria-hidden className="h-px w-6 bg-current" />
              <span aria-hidden className="h-px w-6 bg-current" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
