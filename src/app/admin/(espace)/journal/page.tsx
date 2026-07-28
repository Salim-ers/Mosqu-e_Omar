import type { Metadata } from "next";

import { AdminPageTitle, EmptyState } from "@/components/admin/ui";
import { ACTION_LABELS, readJournal } from "@/lib/admin/journal";
import { requireUser } from "@/lib/auth";
import { formatJanazaDate } from "@/lib/dates";

export const metadata: Metadata = { title: "Journal d’activité" };

/**
 * Journal d'activité : qui a modifié quoi, et quand. Répond à la question qui
 * se pose toujours dans une équipe de bénévoles, et permet de repérer tout de
 * suite une publication faite par erreur.
 */
export default async function JournalPage() {
  await requireUser();
  const lignes = await readJournal(150);

  return (
    <div className="space-y-8">
      <AdminPageTitle
        eyebrow="Le site"
        title="Journal d’activité"
        lead="Les 150 dernières actions faites sur le site. Les plus anciennes s’effacent d’elles-mêmes."
      />

      {lignes.length === 0 ? (
        <EmptyState
          title="Rien à signaler"
          description="Les modifications faites depuis cet espace apparaîtront ici, avec leur auteur et leur date."
        />
      ) : (
        <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {lignes.map((ligne) => (
            <li
              key={ligne.id}
              className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-4"
            >
              <p className="text-[0.95rem] text-charcoal/80">
                <span className="font-medium text-charcoal">
                  {ligne.userName}
                </span>{" "}
                {ACTION_LABELS[ligne.action]}{" "}
                <span className="text-charcoal">{ligne.label}</span>
                <span className="text-charcoal/45"> · {ligne.scope}</span>
              </p>
              <time
                dateTime={ligne.at}
                className="text-[0.72rem] tracking-[0.14em] text-charcoal/45 uppercase"
              >
                {formatJanazaDate(ligne.at)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
