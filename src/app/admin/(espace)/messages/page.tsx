import type { Metadata } from "next";

import { ConfirmButton, SubmitButton } from "@/components/admin/FormButtons";
import {
  AdminPageTitle,
  EmptyState,
  Notice,
  StatusPill,
} from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { formatJanazaDate } from "@/lib/dates";
import { readCollection } from "@/lib/store";

import { deleteMessage, toggleMessageRead } from "../../actions";

export const metadata: Metadata = { title: "Messages" };

/**
 * Boîte de réception du formulaire de contact. Les messages non lus sont en
 * tête ; rien n'est envoyé par courriel, tout se traite ici.
 */
export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireUser();
  const { ok } = await searchParams;

  const messages = [...(await readCollection("messages"))].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return b.createdAt.localeCompare(a.createdAt);
  });
  const nonLus = messages.filter((message) => !message.read).length;

  return (
    <div className="space-y-8">
      <AdminPageTitle
        eyebrow="Le site"
        title="Messages"
        lead={
          nonLus > 0
            ? `${nonLus} message${nonLus > 1 ? "s" : ""} en attente de réponse.`
            : "Les messages envoyés depuis le formulaire de contact du site."
        }
      />

      {ok ? <Notice tone="success">Message mis à jour.</Notice> : null}

      {messages.length === 0 ? (
        <EmptyState
          title="Aucun message"
          description="Les messages envoyés depuis la page Contact du site apparaîtront ici."
        />
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`rounded-[3px] border p-6 sm:p-7 ${
                message.read
                  ? "border-charcoal/12 bg-transparent"
                  : "border-charcoal/25 bg-cream"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-xl font-medium text-charcoal">
                      {message.subject}
                    </span>
                    <StatusPill
                      published={!message.read}
                      labels={["Nouveau", "Traité"]}
                    />
                  </p>
                  <p className="mt-1.5 text-[0.85rem] text-charcoal/55">
                    {message.name} — {formatJanazaDate(message.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={toggleMessageRead.bind(null, message.id)}>
                    <SubmitButton variant="ghost" pendingLabel="…">
                      {message.read ? "Marquer non traité" : "Marquer traité"}
                    </SubmitButton>
                  </form>
                  <form action={deleteMessage.bind(null, message.id)}>
                    <ConfirmButton question="Supprimer définitivement ce message ?">
                      Supprimer
                    </ConfirmButton>
                  </form>
                </div>
              </div>

              <p className="mt-5 border-t border-charcoal/10 pt-5 text-[0.95rem] leading-[1.8] whitespace-pre-line text-charcoal/80">
                {message.body}
              </p>

              <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.85rem]">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(
                    `Re : ${message.subject}`,
                  )}`}
                  className="link-editorial text-charcoal"
                >
                  Répondre à {message.email}
                </a>
                {message.phone ? (
                  <a
                    href={`tel:${message.phone.replace(/[^+0-9]/g, "")}`}
                    className="link-editorial text-charcoal/70"
                  >
                    {message.phone}
                  </a>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
