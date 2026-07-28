import Image from "next/image";
import Link from "next/link";

import { AdminNav, type NavGroup } from "@/components/admin/AdminNav";
import { SubmitButton } from "@/components/admin/FormButtons";
import { RESOURCES } from "@/lib/admin/resources";
import { requireUser } from "@/lib/auth";
import { logoSrc } from "@/lib/media";
import { readCollection } from "@/lib/store";

import { logout } from "../actions";

/**
 * Mise en page de l'espace bénévoles : colonne d'encre à gauche, plan de
 * travail ivoire à droite. La garde d'accès est ici — aucune page enfant ne
 * peut être atteinte sans session valide.
 */
export default async function EspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  const counts = await Promise.all(
    RESOURCES.map(async (resource) => ({
      key: resource.key,
      total: (await readCollection(resource.key)).length,
    })),
  );
  const countOf = (key: string) =>
    counts.find((entry) => entry.key === key)?.total ?? 0;

  const groups: NavGroup[] = [
    {
      title: "Vue d’ensemble",
      items: [{ href: "/admin", label: "Tableau de bord" }],
    },
    {
      title: "Contenus",
      items: RESOURCES.map((resource) => ({
        href: `/admin/contenus/${resource.key}`,
        label: resource.label,
        hint: countOf(resource.key) > 0 ? String(countOf(resource.key)) : undefined,
      })),
    },
    {
      title: "Le site",
      items: [
        { href: "/admin/medias", label: "Photothèque" },
        { href: "/admin/reglages", label: "Réglages du site" },
        ...(user.role === "admin"
          ? [{ href: "/admin/utilisateurs", label: "Comptes bénévoles" }]
          : []),
        { href: "/admin/compte", label: "Mon mot de passe" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ivory lg:flex">
      <aside className="on-dark bg-ink text-ivory lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:overflow-y-auto">
        <div className="flex items-center gap-3 px-5 pt-6 pb-2 lg:pb-4">
          <Image
            src={logoSrc()}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-ivory/20"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-[1.05rem] leading-tight font-medium">
              Mosquée Omar
            </p>
            <p className="text-[0.55rem] font-semibold tracking-[0.28em] text-ivory/45 uppercase">
              Espace bénévoles
            </p>
          </div>
        </div>

        <AdminNav groups={groups} user={{ name: user.name, role: user.role }} />

        <div className="flex flex-wrap items-center gap-4 px-5 pb-8 lg:px-8">
          <Link
            href="/"
            target="_blank"
            className="link-editorial text-[0.72rem] tracking-[0.14em] text-ivory/55 uppercase hover:text-ivory"
          >
            Voir le site ↗
          </Link>
          <form action={logout}>
            <SubmitButton variant="light" pendingLabel="Déconnexion…">
              Se déconnecter
            </SubmitButton>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          {children}
        </div>
      </div>
    </div>
  );
}
