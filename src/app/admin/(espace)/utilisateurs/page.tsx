import type { Metadata } from "next";

import { ConfirmButton, SubmitButton } from "@/components/admin/FormButtons";
import {
  HELP_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
} from "@/components/admin/inputStyles";
import {
  AdminPageTitle,
  Notice,
  Panel,
  StatusPill,
} from "@/components/admin/ui";
import { getUsers, requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/dates";

import {
  createVolunteer,
  resetVolunteerPassword,
  setVolunteerActive,
  setVolunteerRole,
} from "../../actions";

export const metadata: Metadata = { title: "Comptes bénévoles" };

const OK_MESSAGES: Record<string, string> = {
  "compte-cree": "Compte créé — transmettez le mot de passe au bénévole.",
  statut: "Statut du compte modifié.",
  role: "Rôle modifié.",
  "mot-de-passe": "Nouveau mot de passe enregistré.",
};

/**
 * Gestion des comptes. Deux rôles seulement : « responsable » (tout, y compris
 * les réglages et les comptes) et « éditeur » (les contenus).
 */
export default async function UtilisateursPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const current = await requireAdmin();
  const { ok, erreur } = await searchParams;
  const users = [...(await getUsers())].sort((a, b) =>
    a.name.localeCompare(b.name, "fr"),
  );

  return (
    <div className="space-y-8">
      <AdminPageTitle
        eyebrow="Le site"
        title="Comptes bénévoles"
        lead="Chaque bénévole a son propre compte : on sait qui publie quoi, et un départ se règle en désactivant un compte."
      />

      {ok ? <Notice tone="success">{OK_MESSAGES[ok] ?? ok}</Notice> : null}
      {erreur ? <Notice tone="error">{erreur}</Notice> : null}

      <Panel
        title="Créer un compte"
        description="Choisissez un mot de passe provisoire et demandez au bénévole de le changer depuis « Mon mot de passe »."
      >
        <form action={createVolunteer} className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={LABEL_CLASS}>
              Prénom et nom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={`${INPUT_CLASS} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="email" className={LABEL_CLASS}>
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="off"
              className={`${INPUT_CLASS} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="password" className={LABEL_CLASS}>
              Mot de passe provisoire
            </label>
            <input
              id="password"
              name="password"
              type="text"
              required
              autoComplete="off"
              className={`${INPUT_CLASS} mt-2`}
            />
            <p className={HELP_CLASS}>
              Au moins 10 caractères, avec des lettres et des chiffres.
            </p>
          </div>
          <div>
            <label htmlFor="role" className={LABEL_CLASS}>
              Rôle
            </label>
            <select
              id="role"
              name="role"
              defaultValue="editeur"
              className={`${INPUT_CLASS} mt-2`}
            >
              <option value="editeur">Éditeur — contenus du site</option>
              <option value="admin">Responsable — tout, y compris comptes</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <SubmitButton pendingLabel="Création…">Créer le compte</SubmitButton>
          </div>
        </form>
      </Panel>

      <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
        {users.map((user) => (
          <li key={user.id} className="py-6">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-xl font-medium text-charcoal">
                    {user.name}
                  </span>
                  <StatusPill
                    published={user.active}
                    labels={["Actif", "Désactivé"]}
                  />
                  <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-charcoal/45 uppercase">
                    {user.role === "admin" ? "Responsable" : "Éditeur"}
                  </span>
                </p>
                <p className="mt-1.5 text-[0.85rem] text-charcoal/55">
                  {user.email}
                  {user.lastLoginAt
                    ? ` — dernière connexion le ${formatDate(user.lastLoginAt)}`
                    : " — jamais connecté"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <form
                  action={setVolunteerRole.bind(
                    null,
                    user.id,
                    user.role === "admin" ? "editeur" : "admin",
                  )}
                >
                  <SubmitButton variant="ghost" pendingLabel="…">
                    {user.role === "admin"
                      ? "Passer en éditeur"
                      : "Passer en responsable"}
                  </SubmitButton>
                </form>
                {user.id === current.id ? null : (
                  <form
                    action={setVolunteerActive.bind(null, user.id, !user.active)}
                  >
                    <SubmitButton variant="ghost" pendingLabel="…">
                      {user.active ? "Désactiver" : "Réactiver"}
                    </SubmitButton>
                  </form>
                )}
              </div>
            </div>

            <form
              action={resetVolunteerPassword.bind(null, user.id)}
              className="mt-4 flex flex-wrap items-end gap-3"
            >
              <div className="min-w-[16rem] flex-1">
                <label
                  htmlFor={`password-${user.id}`}
                  className={`${LABEL_CLASS} text-charcoal/40`}
                >
                  Nouveau mot de passe
                </label>
                <input
                  id={`password-${user.id}`}
                  name="password"
                  type="text"
                  autoComplete="off"
                  placeholder="Laisser vide pour ne rien changer"
                  className={`${INPUT_CLASS} mt-2`}
                />
              </div>
              <ConfirmButton
                variant="ghost"
                question={`Réinitialiser le mot de passe de ${user.name} ?`}
                pendingLabel="…"
              >
                Réinitialiser
              </ConfirmButton>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
