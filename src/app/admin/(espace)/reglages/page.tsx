import type { Metadata } from "next";

import { SubmitButton } from "@/components/admin/FormButtons";
import {
  HELP_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
} from "@/components/admin/inputStyles";
import { AdminPageTitle, Notice, Panel } from "@/components/admin/ui";
import { site } from "@/config/site";
import { requireAdmin } from "@/lib/auth";
import { readReglages } from "@/lib/store";

import { saveSettings } from "../../actions";

export const metadata: Metadata = { title: "Réglages du site" };

/**
 * Réglages généraux. Chaque champ laissé vide retombe sur la valeur d'origine
 * du site — impossible de « vider » une information par inadvertance.
 */
export default async function ReglagesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const { ok } = await searchParams;
  const reglages = await readReglages();

  const field = (
    name: string,
    label: string,
    value: string,
    options: { help?: string; placeholder?: string; type?: string } = {},
  ) => (
    <div>
      <label htmlFor={name} className={LABEL_CLASS}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={options.type ?? "text"}
        defaultValue={value}
        placeholder={options.placeholder}
        className={`${INPUT_CLASS} mt-2`}
      />
      {options.help ? <p className={HELP_CLASS}>{options.help}</p> : null}
    </div>
  );

  return (
    <div className="space-y-8">
      <AdminPageTitle
        eyebrow="Le site"
        title="Réglages du site"
        lead="Les informations qui apparaissent un peu partout : horaire de la Jumu‘a, coordonnées, liens de don, bandeau d’information."
      />

      {ok ? (
        <Notice tone="success">Réglages enregistrés — le site est à jour.</Notice>
      ) : null}

      <form action={saveSettings} className="space-y-6">
        <Panel
          title="Bandeau d’information"
          description="Un message court affiché en haut de toutes les pages. À utiliser avec parcimonie : horaire exceptionnel, fermeture, appel urgent."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="bannerActive"
                  defaultChecked={reglages.bannerActive}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#181816]"
                />
                <span className="text-[0.95rem] text-charcoal">
                  Afficher le bandeau
                </span>
              </label>
            </div>
            <div className="sm:col-span-2">
              {field("bannerText", "Message", reglages.bannerText, {
                placeholder: "Prière de l’Aïd : dimanche 9 h 00",
              })}
            </div>
            {field("bannerHref", "Lien (facultatif)", reglages.bannerHref, {
              placeholder: "/evenements",
            })}
          </div>
        </Panel>

        <Panel
          title="Horaires"
          description="Les cinq prières viennent de MAWAQIT et ne se modifient pas ici. Seule la Jumu‘a, annoncée par la mosquée, est réglée sur le site."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {field("jumua", "Horaire de la Jumu‘a", reglages.jumua, {
              placeholder: site.mawaqit.jumua ?? "13h15",
              help: "Laissez vide pour ne pas afficher d’heure et renvoyer uniquement vers MAWAQIT.",
            })}
          </div>
        </Panel>

        <Panel title="Coordonnées">
          <div className="grid gap-6 sm:grid-cols-2">
            {field("contactPhone", "Téléphone", reglages.contactPhone, {
              placeholder: site.contact.phone,
            })}
            {field("contactEmail", "Adresse email", reglages.contactEmail, {
              placeholder: site.contact.email,
              type: "email",
            })}
            {field("addressStreet", "Adresse", reglages.addressStreet, {
              placeholder: site.address.street,
            })}
            <div className="grid grid-cols-2 gap-4">
              {field("addressPostalCode", "Code postal", reglages.addressPostalCode, {
                placeholder: site.address.postalCode,
              })}
              {field("addressCity", "Ville", reglages.addressCity, {
                placeholder: site.address.city,
              })}
            </div>
          </div>
        </Panel>

        <Panel
          title="Dons"
          description="Adresses des campagnes de don. Une adresse HelloAsso (…/formulaires/…) est intégrée directement dans la page du site : le donateur ne quitte pas la mosquée. Toute autre adresse affiche un bouton qui y mène."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {field("donationUrl", "Don ponctuel", reglages.donationUrl, {
              placeholder: site.donation.onlineUrl,
            })}
            {field(
              "monthlyDonationUrl",
              "Don mensuel",
              reglages.monthlyDonationUrl,
              { placeholder: site.donation.monthlyUrl },
            )}
          </div>
        </Panel>

        <Panel
          title="Réseaux sociaux"
          description="Une ligne par compte, au format : Nom | https://adresse — seuls les comptes officiels de l’association."
        >
          <textarea
            name="socials"
            rows={4}
            defaultValue={reglages.socials
              .map((social) => `${social.label} | ${social.href}`)
              .join("\n")}
            placeholder="Facebook | https://facebook.com/…"
            className={`${INPUT_CLASS} min-h-28 leading-relaxed`}
          />
        </Panel>

        <div className="border-t border-charcoal/12 pt-7">
          <SubmitButton>Enregistrer les réglages</SubmitButton>
        </div>
      </form>
    </div>
  );
}
