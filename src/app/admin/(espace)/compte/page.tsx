import type { Metadata } from "next";

import { SubmitButton } from "@/components/admin/FormButtons";
import {
  HELP_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
} from "@/components/admin/inputStyles";
import { AdminPageTitle, Notice, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";

import { changeOwnPassword } from "../../actions";

export const metadata: Metadata = { title: "Mon mot de passe" };

export default async function ComptePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const user = await requireUser();
  const { ok, erreur } = await searchParams;

  return (
    <div className="space-y-8">
      <AdminPageTitle
        eyebrow="Mon compte"
        title="Mon mot de passe"
        lead={`Connecté avec ${user.email}.`}
      />

      {ok ? <Notice tone="success">Mot de passe modifié.</Notice> : null}
      {erreur ? <Notice tone="error">{erreur}</Notice> : null}

      <Panel
        title="Changer de mot de passe"
        description="Choisissez un mot de passe que vous n’utilisez nulle part ailleurs."
      >
        <form action={changeOwnPassword} className="max-w-md">
          <label htmlFor="password" className={LABEL_CLASS}>
            Nouveau mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            className={`${INPUT_CLASS} mt-2`}
          />
          <p className={HELP_CLASS}>
            Au moins 10 caractères, avec des lettres et des chiffres.
          </p>
          <div className="mt-6">
            <SubmitButton>Enregistrer</SubmitButton>
          </div>
        </form>
      </Panel>
    </div>
  );
}
