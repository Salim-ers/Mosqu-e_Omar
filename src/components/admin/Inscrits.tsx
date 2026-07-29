import { ConfirmButton, SubmitButton } from "@/components/admin/FormButtons";
import { EmptyState, StatusPill } from "@/components/admin/ui";
import { formatJanazaDate } from "@/lib/dates";
import { readCollection } from "@/lib/store";

import { deleteInscrit, toggleInscritTraite } from "@/app/admin/actions";

/**
 * Les demandes d'inscription reçues, groupées par cours : c'est la question
 * que se pose la mosquée à chaque rentrée — qui s'est inscrit, et à quoi.
 * Les demandes non traitées passent en tête de chaque groupe.
 */
export async function Inscrits() {
  const inscrits = await readCollection("inscrits");

  if (inscrits.length === 0) {
    return (
      <div className="border-t border-charcoal/12 pt-10">
        <h2 className="font-display text-2xl font-medium text-charcoal">
          Les inscrits
        </h2>
        <div className="mt-6">
          <EmptyState
            title="Aucune demande pour l’instant"
            description="Les demandes envoyées depuis le formulaire de la page Inscriptions apparaîtront ici, classées par cours."
          />
        </div>
      </div>
    );
  }

  // Un groupe par cours, les cours les plus demandés d'abord.
  const groupes = new Map<string, typeof inscrits>();
  for (const inscrit of inscrits) {
    const liste = groupes.get(inscrit.cours) ?? [];
    liste.push(inscrit);
    groupes.set(inscrit.cours, liste);
  }

  const enAttente = inscrits.filter((i) => !i.traite).length;

  return (
    <div className="space-y-8 border-t border-charcoal/12 pt-10">
      <div>
        <h2 className="font-display text-2xl font-medium text-charcoal">
          Les inscrits — {inscrits.length}
        </h2>
        <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-charcoal/60">
          {enAttente > 0
            ? `${enAttente} demande${enAttente > 1 ? "s" : ""} en attente d’être traitée${enAttente > 1 ? "s" : ""}. Marquez-les au fur et à mesure que vous rappelez les familles.`
            : "Toutes les demandes ont été traitées."}
        </p>
      </div>

      {[...groupes.entries()].map(([cours, liste]) => {
        const ordonnee = [...liste].sort((a, b) => {
          if (a.traite !== b.traite) return a.traite ? 1 : -1;
          return b.createdAt.localeCompare(a.createdAt);
        });

        return (
          <section key={cours}>
            <h3 className="flex flex-wrap items-baseline gap-3 text-[0.66rem] font-semibold tracking-[0.24em] text-charcoal/55 uppercase">
              {cours}
              <span className="text-charcoal/35">
                {liste.length} inscrit{liste.length > 1 ? "s" : ""}
              </span>
            </h3>

            <ul className="mt-4 divide-y divide-charcoal/10 border-y border-charcoal/10">
              {ordonnee.map((inscrit) => (
                <li
                  key={inscrit.id}
                  className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 py-5"
                >
                  <div className="min-w-0 flex-1">
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

                    <p className="mt-1.5 text-[0.85rem] text-charcoal/60">
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
            </ul>
          </section>
        );
      })}
    </div>
  );
}
