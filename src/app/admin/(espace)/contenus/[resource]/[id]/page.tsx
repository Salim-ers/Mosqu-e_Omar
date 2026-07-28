import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FieldControl } from "@/components/admin/FieldControl";
import { ConfirmButton, SubmitButton } from "@/components/admin/FormButtons";
import { INPUT_CLASS, LABEL_CLASS } from "@/components/admin/inputStyles";
import { AdminLink, AdminPageTitle, Notice } from "@/components/admin/ui";
import { emptyRecord, type AdminRecord } from "@/lib/admin/records";
import { getResource } from "@/lib/admin/resources";
import { requireUser } from "@/lib/auth";
import { findRecord } from "@/lib/store";

import { deleteResource, saveResource } from "../../../../actions";

type Params = { resource: string; id: string };

/** Préfixe d'URL publique affiché à côté du champ « adresse de la page ». */
const SLUG_PREFIXES: Record<string, string> = {
  actualites: "/actualites/",
  activites: "/activites/",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { resource, id } = await params;
  const def = getResource(resource);
  if (!def) return { title: "Contenu" };
  return { title: id === "nouveau" ? def.newLabel : `Modifier — ${def.label}` };
}

export default async function ResourceFormPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  await requireUser();

  const { resource, id } = await params;
  const def = getResource(resource);
  if (!def) notFound();

  const isNew = id === "nouveau";
  const stored = isNew
    ? null
    : ((await findRecord(def.key, id)) as AdminRecord | null);
  if (!isNew && !stored) notFound();

  const record = stored ?? emptyRecord(def);
  const { erreur } = await searchParams;

  return (
    <div className="space-y-8">
      <AdminPageTitle
        eyebrow={def.label}
        title={isNew ? def.newLabel : "Modifier"}
        lead={isNew ? def.description : undefined}
        actions={
          <AdminLink href={`/admin/contenus/${def.key}`}>
            ← Retour à la liste
          </AdminLink>
        }
      />

      {erreur ? <Notice tone="error">{erreur}</Notice> : null}

      <form
        action={saveResource.bind(null, def.key, id)}
        className="space-y-10"
      >
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {def.fields.map((field) => (
            <FieldControl
              key={field.name}
              field={field}
              value={record[field.name]}
              slugPrefix={SLUG_PREFIXES[def.key] ?? "/"}
            />
          ))}
        </div>

        <fieldset className="rounded-[3px] border border-charcoal/12 bg-cream p-6">
          <legend className="px-2 text-[0.62rem] font-semibold tracking-[0.24em] text-charcoal/45 uppercase">
            Publication
          </legend>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="published"
                defaultChecked={Boolean(record.published)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#181816]"
              />
              <span>
                <span className="text-[0.95rem] text-charcoal">
                  Visible sur le site
                </span>
                <span className="mt-1 block text-[0.8rem] leading-relaxed text-charcoal/50">
                  Décochez pour garder ce contenu en brouillon : il reste
                  invisible pour les visiteurs et modifiable ici.
                </span>
              </span>
            </label>

            {def.sortable ? (
              <div>
                <label htmlFor="order" className={LABEL_CLASS}>
                  Ordre d’affichage
                </label>
                <input
                  id="order"
                  name="order"
                  type="number"
                  defaultValue={
                    typeof record.order === "number" ? record.order : 0
                  }
                  className={`${INPUT_CLASS} mt-2`}
                />
                <p className="mt-2 text-[0.8rem] leading-relaxed text-charcoal/50">
                  Les plus petits nombres s’affichent en premier.
                </p>
              </div>
            ) : null}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/12 pt-7">
          <SubmitButton>
            {isNew ? "Créer et publier" : "Enregistrer les modifications"}
          </SubmitButton>
          {!isNew ? (
            <ConfirmButton
              question="Supprimer définitivement cet élément ?"
              formAction={deleteResource.bind(null, def.key, id)}
            >
              Supprimer
            </ConfirmButton>
          ) : null}
        </div>
      </form>
    </div>
  );
}
