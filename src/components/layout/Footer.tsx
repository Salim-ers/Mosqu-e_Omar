import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";
import { getSettings } from "@/lib/content";
import { getLogoSite } from "@/lib/content";

export async function Footer() {
  const year = new Date().getFullYear();
  const [settings, logo] = await Promise.all([getSettings(), getLogoSite()]);

  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-ivory">
      <div aria-hidden className="pattern-zellige absolute inset-0" />

      <Container className="relative">
        {/* Bandeau supérieur — identité */}
        <div className="flex flex-col gap-10 border-b border-ivory/10 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <div className="max-w-2xl">
            <p
              className="font-arabic text-2xl leading-relaxed text-ivory/90"
              lang="ar"
              dir="rtl"
            >
              {site.arabicName}
            </p>
            <p className="mt-4 font-display text-4xl leading-[1.05] font-medium sm:text-5xl">
              Mosquée Omar
              <br />
              Ibn al Khattab
            </p>
            <p className="mt-4 text-[0.68rem] font-semibold tracking-[0.32em] text-ivory/80 uppercase">
              Creil — Oise · {site.association.acronym} · Depuis{" "}
              {site.association.foundedYear}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Image
              src={logo.url}
              alt={logo.alt}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover ring-1 ring-ivory/20"
            />
            <p className="max-w-[16rem] text-[0.85rem] leading-relaxed text-ivory/85">
              Un lieu de foi, de transmission et de fraternité, porté par
              l’association {site.association.acronym}.
            </p>
          </div>
        </div>

        {/* Colonnes */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          <nav aria-label="Pied de page — la mosquée">
            <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-ivory/75 uppercase">
              La mosquée
            </p>
            <ul className="mt-5 space-y-3 text-[0.9rem]">
              {site.navigation.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-editorial text-ivory/92 hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Pied de page — participer">
            <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-ivory/75 uppercase">
              Participer
            </p>
            <ul className="mt-5 space-y-3 text-[0.9rem]">
              {site.navigation.secondary.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-editorial text-ivory/92 hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.mawaqit.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-editorial text-ivory/92 hover:text-ivory"
                >
                  Horaires sur MAWAQIT ↗
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-ivory/75 uppercase">
              Nous trouver
            </p>
            <address className="mt-5 space-y-3 text-[0.9rem] not-italic text-ivory/92">
              <p>
                {settings.address.street}, {settings.address.postalCode}{" "}
                {settings.address.city}
              </p>
              <p>
                <a href={settings.phoneHref} className="link-editorial">
                  {settings.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${settings.email}`}
                  className="link-editorial break-all"
                >
                  {settings.email}
                </a>
              </p>
            </address>
          </div>

          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-ivory/75 uppercase">
              L’association
            </p>
            <div className="mt-5 space-y-3 text-[0.9rem] text-ivory/85">
              <p>
                {site.association.acronym} — {site.association.description}
              </p>
              <p>SIRET {site.association.siret}</p>
              {settings.socials.length > 0 ? (
                <ul className="space-y-2 pt-1">
                  {settings.socials.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-editorial text-ivory/92"
                      >
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="flex flex-col gap-4 border-t border-ivory/10 py-8 text-[0.75rem] text-ivory/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.longName} — {site.association.acronym}. Tous droits
            réservés.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {site.navigation.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-editorial">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              {/* Entrée discrète de l'équipe qui met le site à jour. */}
              <Link
                href="/admin"
                className="link-editorial text-ivory/60 hover:text-ivory"
              >
                Se connecter (bénévoles)
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
