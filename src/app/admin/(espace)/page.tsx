import Link from "next/link";

import { SubmitButton } from "@/components/admin/FormButtons";
import {
  AdminLink,
  AdminPageTitle,
  Notice,
  Panel,
} from "@/components/admin/ui";
import { RESOURCES } from "@/lib/admin/resources";
import { requireUser } from "@/lib/auth";
import { getEvents, getJanaza } from "@/lib/content";
import { formatDate } from "@/lib/dates";
import { readCollection } from "@/lib/store";

import { importExistingContent } from "../actions";

/** Tableau de bord : ce qu'il y a à faire, et les raccourcis les plus utiles. */
export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const user = await requireUser();
  const { ok, erreur } = await searchParams;

  const stats = await Promise.all(
    RESOURCES.map(async (resource) => {
      const list = (await readCollection(resource.key)) as {
        published: boolean;
      }[];
      return {
        key: resource.key,
        label: resource.label,
        total: list.length,
        drafts: list.filter((item) => !item.published).length,
      };
    }),
  );

  const [janaza, events] = await Promise.all([getJanaza(), getEvents()]);
  const isEmpty = stats.every((stat) => stat.total === 0);

  return (
    <div className="space-y-10">
      <AdminPageTitle
        eyebrow="Espace bénévoles"
        title={`Bonjour ${user.name.split(" ")[0]}`}
        lead="Tout ce qui est modifiable sur le site se trouve dans la colonne de gauche. Chaque enregistrement met le site à jour immédiatement."
        actions={
          <>
            <AdminLink href="/admin/contenus/annonces/nouveau" variant="primary">
              Publier une annonce
            </AdminLink>
            <AdminLink href="/admin/contenus/janaza/nouveau">
              Annonce de janaza
            </AdminLink>
          </>
        }
      />

      {erreur === "reserve" ? (
        <Notice tone="error">
          Cette rubrique est réservée aux responsables de l’association.
        </Notice>
      ) : null}
      {ok ? <Notice tone="success">{ok}</Notice> : null}

      {isEmpty ? (
        <Panel
          title="Reprendre les contenus déjà en ligne"
          description="Les activités, services, inscriptions et annonces actuellement affichés sur le site ont été écrits dans le code. Importez-les une fois pour pouvoir les modifier ici — rien ne change pour les visiteurs."
        >
          <form action={importExistingContent}>
            <SubmitButton pendingLabel="Import en cours…">
              Importer les contenus existants
            </SubmitButton>
          </form>
        </Panel>
      ) : null}

      <section>
        <h2 className="text-[0.62rem] font-semibold tracking-[0.28em] text-charcoal/45 uppercase">
          Vos rubriques
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <li key={stat.key}>
              <Link
                href={`/admin/contenus/${stat.key}`}
                className="group flex h-full flex-col justify-between rounded-[3px] border border-charcoal/12 bg-cream p-5 transition-colors hover:border-charcoal/35"
              >
                <span className="font-display text-xl font-medium text-charcoal">
                  {stat.label}
                </span>
                <span className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-3xl leading-none text-charcoal">
                    {stat.total}
                  </span>
                  <span className="text-[0.72rem] tracking-[0.14em] text-charcoal/45 uppercase">
                    {stat.total > 1 ? "éléments" : "élément"}
                    {stat.drafts > 0 ? ` · ${stat.drafts} en brouillon` : ""}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Prochaines janaza">
          {janaza.length === 0 ? (
            <p className="text-[0.9rem] text-charcoal/55">
              Aucune annonce en cours.
            </p>
          ) : (
            <ul className="space-y-3">
              {janaza.slice(0, 4).map((entry) => (
                <li key={entry.id} className="text-[0.92rem] text-charcoal/75">
                  <span className="font-medium text-charcoal">{entry.name}</span>
                  <span className="text-charcoal/45">
                    {" — "}
                    {formatDate(entry.prayerAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Événements à venir">
          {events.upcoming.length === 0 ? (
            <p className="text-[0.9rem] text-charcoal/55">
              Aucun événement programmé pour le moment.
            </p>
          ) : (
            <ul className="space-y-3">
              {events.upcoming.slice(0, 4).map((event) => (
                <li key={event.id} className="text-[0.92rem] text-charcoal/75">
                  <span className="font-medium text-charcoal">{event.title}</span>
                  <span className="text-charcoal/45">
                    {" — "}
                    {formatDate(event.startsAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
