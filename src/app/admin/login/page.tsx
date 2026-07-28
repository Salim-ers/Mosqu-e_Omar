import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SubmitButton } from "@/components/admin/FormButtons";
import {
  HELP_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
} from "@/components/admin/inputStyles";
import { site } from "@/config/site";
import { getCurrentUser, hasAnyUser } from "@/lib/auth";
import { logoSrc } from "@/lib/media";

import { createFirstAccount, login } from "./actions";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  if (await getCurrentUser()) redirect("/admin");

  const { erreur } = await searchParams;
  const first = !(await hasAnyUser());

  return (
    <div className="on-dark relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-5 py-16 text-ivory">
      <div aria-hidden className="pattern-khatam-light absolute inset-0" />

      <div className="relative w-full max-w-md">
        <div className="flex items-center gap-4">
          <Image
            src={logoSrc()}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover ring-1 ring-ivory/20"
          />
          <div>
            <p className="font-display text-xl leading-tight font-medium">
              {site.name}
            </p>
            <p className="text-[0.6rem] font-semibold tracking-[0.3em] text-ivory/50 uppercase">
              Espace bénévoles
            </p>
          </div>
        </div>

        <h1 className="mt-10 font-display text-4xl leading-tight font-medium">
          {first ? "Créer le compte responsable" : "Connexion"}
        </h1>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-ivory/60">
          {first
            ? "Aucun compte n’existe encore. Ce premier compte pourra ensuite créer ceux des autres bénévoles."
            : "Réservé aux bénévoles de l’association chargés de mettre le site à jour."}
        </p>

        {erreur ? (
          <p
            role="alert"
            className="mt-6 rounded-[2px] border border-[#d98a7a]/40 bg-[#8a2a20]/25 px-4 py-3 text-[0.86rem] leading-relaxed text-[#f4d9d3]"
          >
            {erreur}
          </p>
        ) : null}

        <form
          action={first ? createFirstAccount : login}
          className="mt-8 space-y-5"
        >
          {first ? (
            <div>
              <label htmlFor="name" className={`${LABEL_CLASS} text-ivory/55`}>
                Prénom et nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={`${INPUT_CLASS} mt-2 border-ivory/20 bg-ivory/5 text-ivory placeholder:text-ivory/30 focus:border-ivory`}
              />
            </div>
          ) : null}

          <div>
            <label htmlFor="email" className={`${LABEL_CLASS} text-ivory/55`}>
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={`${INPUT_CLASS} mt-2 border-ivory/20 bg-ivory/5 text-ivory placeholder:text-ivory/30 focus:border-ivory`}
            />
          </div>

          <div>
            <label htmlFor="password" className={`${LABEL_CLASS} text-ivory/55`}>
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete={first ? "new-password" : "current-password"}
              className={`${INPUT_CLASS} mt-2 border-ivory/20 bg-ivory/5 text-ivory placeholder:text-ivory/30 focus:border-ivory`}
            />
            {first ? (
              <p className={`${HELP_CLASS} text-ivory/45`}>
                Au moins 10 caractères, avec des lettres et des chiffres.
              </p>
            ) : null}
          </div>

          <div className="pt-2">
            <SubmitButton
              variant="light"
              pendingLabel={first ? "Création…" : "Connexion…"}
            >
              {first ? "Créer le compte" : "Se connecter"}
            </SubmitButton>
          </div>
        </form>

        <p className="mt-10 text-[0.8rem] text-ivory/40">
          <Link href="/" className="link-editorial">
            ← Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}
