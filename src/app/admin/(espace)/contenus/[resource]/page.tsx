import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ConfirmButton, SubmitButton } from "@/components/admin/FormButtons";
import { Inscrits } from "@/components/admin/Inscrits";
import { Phototheque } from "@/components/admin/Phototheque";
import {
  AdminLink,
  AdminPageTitle,
  EmptyState,
  Notice,
  StatusPill,
} from "@/components/admin/ui";
import { contenuDOrigine } from "@/lib/admin/origine";
import { getResource, type ResourceDef } from "@/lib/admin/resources";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/dates";
import { readCollection } from "@/lib/store";

import {
  deleteResource,
  importExistingContent,
  toggleResourcePublished,
} from "../../../actions";

type Params = { resource: string };
type Row = Record<string, unknown> & {
  id: string;
  published: boolean;
  createdAt: string;
  order?: number;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { resource } = await params;
  return { title: getResource(resource)?.label ?? "Contenus" };
}

const MESSAGES: Record<string, string> = {
  enregistre: "Modification enregistrée — le site est à jour.",
  supprime: "Élément supprimé.",
  statut: "Statut modifié.",
  inscrit: "Demande d’inscription mise à jour.",
  "inscrit-supprime": "Demande d’inscription supprimée.",
};

export default async function ResourceListPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  await requireUser();

  const { resource } = await params;
  const def = getResource(resource);
  if (!def) notFound();

  const { ok, erreur } = await searchParams;
  const rows = sortRows(def, (await readCollection(def.key)) as Row[]);
  const origine = contenuDOrigine(def.key);

  return (
    <div className="space-y-8">
      <AdminPageTitle
        eyebrow="Contenus"
        title={def.label}
        lead={def.description}
        actions={
          <AdminLink
            href={`/admin/contenus/${def.key}/nouveau`}
            variant="primary"
          >
            {def.newLabel}
          </AdminLink>
        }
      />

      {ok ? <Notice tone="success">{MESSAGES[ok] ?? ok}</Notice> : null}
      {erreur ? <Notice tone="error">{erreur}</Notice> : null}
      {rows.length > 0 && origine && origine.total > 0 && origine.importable ? (
        <Notice>
          Attention : ces contenus remplacent ceux d’origine. {origine.description}
        </Notice>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          title={
            origine && origine.total > 0
              ? "Rien ici — mais le site n’est pas vide"
              : "Rien à afficher pour l’instant"
          }
          description={
            origine
              ? origine.description
              : `Aucun contenu dans « ${def.label} ». Créez le premier — il apparaîtra sur le site dès son enregistrement.`
          }
          action={
            <div className="flex flex-wrap justify-center gap-3">
              {origine?.importable ? (
                <form action={importExistingContent}>
                  <SubmitButton pendingLabel="Import en cours…">
                    Reprendre ces contenus
                  </SubmitButton>
                </form>
              ) : null}
              <AdminLink
                href={`/admin/contenus/${def.key}/nouveau`}
                variant={origine?.importable ? "ghost" : "primary"}
              >
                {def.newLabel}
              </AdminLink>
            </div>
          }
        />
      ) : (
        <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {rows.map((row) => (
            <li
              key={row.id}
              className="zellige-hover flex flex-wrap items-start justify-between gap-x-6 gap-y-3 py-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/admin/contenus/${def.key}/${row.id}`}
                    className="link-editorial font-display text-xl leading-tight font-medium text-charcoal"
                  >
                    {text(row[def.titleField]) || "(sans titre)"}
                  </Link>
                  <StatusPill published={row.published} />
                  {def.dateField ? (
                    <span className="text-[0.72rem] tracking-[0.16em] text-charcoal/45 uppercase">
                      {formatDate(text(row[def.dateField])) ||
                        text(row[def.dateField])}
                    </span>
                  ) : null}
                </div>
                {def.subtitleField ? (
                  <p className="mt-1.5 line-clamp-2 max-w-2xl text-[0.88rem] leading-relaxed text-charcoal/55">
                    {text(row[def.subtitleField])}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <form
                  action={toggleResourcePublished.bind(null, def.key, row.id)}
                >
                  <SubmitButton variant="ghost" pendingLabel="…">
                    {row.published ? "Dépublier" : "Publier"}
                  </SubmitButton>
                </form>
                <AdminLink href={`/admin/contenus/${def.key}/${row.id}`}>
                  Modifier
                </AdminLink>
                <form action={deleteResource.bind(null, def.key, row.id)}>
                  <ConfirmButton
                    question={
                      def.sensitive
                        ? "Supprimer définitivement cette annonce ?"
                        : "Supprimer définitivement cet élément ?"
                    }
                  >
                    Supprimer
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {def.key === "inscriptions" ? <Inscrits /> : null}
      {def.key === "albums" ? <Phototheque /> : null}
    </div>
  );
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Tri d'affichage : ordre manuel si la rubrique en a un, sinon date. */
function sortRows(def: ResourceDef, rows: Row[]): Row[] {
  const copy = [...rows];
  if (def.sortable) {
    return copy.sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return a.createdAt.localeCompare(b.createdAt);
    });
  }
  const field = def.dateField;
  if (!field) return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return copy.sort((a, b) => text(b[field]).localeCompare(text(a[field])));
}
