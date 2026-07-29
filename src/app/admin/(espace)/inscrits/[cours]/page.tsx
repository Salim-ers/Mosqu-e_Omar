import type { Metadata } from "next";

import { ConfirmButton, SubmitButton } from "@/components/admin/FormButtons";
import {
  AdminLink,
  AdminPageTitle,
  EmptyState,
  Notice,
  StatusPill,
} from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { formatJanazaDate } from "@/lib/dates";
import { readCollection } from "@/lib/store";

import { deleteInscrit, toggleInscritTraite } from "../../../actions";

type Params = { cours: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { cours } = await params;
  return { title: decodeURIComponent(cours) };
}

/**
 * Les inscrits d'un cours. Une page par cours plutôt qu'une longue liste
 * commune : à la rentrée, on travaille un groupe à la fois — on appelle les
 * familles inscrites au Coran, puis celles de l'arabe.
 */
export default async function InscritsDunCoursPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireUser();

  const [{ cours: brut }, { ok }] = await Promise.all([params, searchParams]);
  const cours = decodeURIComponent(brut);

  const inscrits = (await readCollection("inscrits"))
    .filter((inscrit) => inscrit.cours === cours)
    .sort((a, b) => {
      if (a.traite !== b.traite) return a.traite ? 1 : -1;
      return b.createdAt.localeCompare(a.createdAt);
    });

  const aRappeler = inscrits.filter((inscrit) => !inscrit.traite).length;

  return (
    <div className="space-y-8">
      <AdminPageTitle
        eyebrow="Inscriptions"
        title={cours}
        lead={
          inscrits.length === 0
            ? "Aucune demande reçue pour ce cours."
            : `${inscrits.length} inscrit${inscrits.length > 1 ? "s" : ""}${
                aRappeler > 0
                  ? ` — ${aRappeler} à rappeler`
                  : " — toutes les demandes ont été traitées"
              }.`
        }
        actions={
          <AdminLink href="/admin/contenus/inscriptions">
            ← Retour aux inscriptions
          </AdminLink>
        }
      />

      {ok ? <Notice tone="success">Demande mise à jour.</Notice> : null}

      {inscrits.length === 0 ? (
        <EmptyState
          title="Personne pour l’instant"
          description={`Les demandes envoyées depuis le site pour « ${cours} » apparaîtront ici, avec les coordonnées à rappeler.`}
        />
      ) : (
        <ol className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {inscrits.map((inscrit, index) => (
            <li
              key={inscrit.id}
              className="zellige-hover flex flex-wrap items-start justify-between gap-x-6 gap-y-3 py-5"
            >
              <div className="flex min-w-0 flex-1 gap-5">
                <span
                  aria-hidden
                  className="font-display text-xl italic text-charcoal/30"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-xl font-medium text-charcoal">
                      {inscrit.prenom} {inscrit.nom}
                    </span>
                    {inscrit.age ? (
                      <span className="text-[0.85rem] text-charcoal/55">
                        {inscrit.age}
                      </span>
                    ) : null}
                    <StatusPill
                      published={!inscrit.traite}
                      labels={["À rappeler", "Traité"]}
                    />
                  </p>

                  <p className="mt-1.5 text-[0.88rem] text-charcoal/65">
                    {inscrit.contactNom ? `${inscrit.contactNom} — ` : ""}
                    {inscrit.telephone ? (
                      <a
                        href={`tel:${inscrit.telephone.replace(/[^+0-9]/g, "")}`}
                        className="link-editorial text-charcoal"
                      >
                        {inscrit.telephone}
                      </a>
                    ) : null}
                    {inscrit.telephone && inscrit.email ? " · " : ""}
                    {inscrit.email ? (
                      <a
                        href={`mailto:${inscrit.email}`}
                        className="link-editorial text-charcoal"
                      >
                        {inscrit.email}
                      </a>
                    ) : null}
                  </p>

                  {inscrit.message ? (
                    <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed whitespace-pre-line text-charcoal/60">
                      {inscrit.message}
                    </p>
                  ) : null}

                  <p className="mt-1.5 text-[0.72rem] tracking-[0.14em] text-charcoal/40 uppercase">
                    Demande du {formatJanazaDate(inscrit.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <form action={toggleInscritTraite.bind(null, inscrit.id)}>
                  <SubmitButton variant="ghost" pendingLabel="…">
                    {inscrit.traite ? "À rappeler" : "Marquer traité"}
                  </SubmitButton>
                </form>
                <form action={deleteInscrit.bind(null, inscrit.id)}>
                  <ConfirmButton question="Supprimer définitivement cette demande ?">
                    Supprimer
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
