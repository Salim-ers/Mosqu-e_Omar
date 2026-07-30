import { EcranChargement } from "@/components/layout/EcranChargement";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSettings } from "@/lib/content";
import { mosqueJsonLd, organizationJsonLd } from "@/lib/seo";

/** Mise en page du site public : bandeau, contenu, pied de page. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  const { banner, phone, phoneHref, address } = settings;

  return (
    <>
      {/* Sans JavaScript, les blocs en attente de révélation resteraient
          invisibles : cette règle les rétablit. */}
      <noscript>
        <style>{`.reveal{opacity:1 !important;transform:none !important}.splash{display:none !important}`}</style>
      </noscript>
      <EcranChargement />
      <a
        href="#contenu"
        className="sr-only z-[130] rounded-[2px] bg-ink px-5 py-3 text-sm text-ivory focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Aller au contenu
      </a>
      <Header
        banner={banner}
        contact={{
          phone,
          phoneHref,
          address: `${address.street}, ${address.postalCode} ${address.city}`,
        }}
      />
      <main id="contenu">{children}</main>
      <Footer />
      <JsonLd data={[mosqueJsonLd(), organizationJsonLd()]} />
    </>
  );
}
