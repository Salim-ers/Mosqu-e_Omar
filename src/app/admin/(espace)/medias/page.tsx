import type { Metadata } from "next";

import { ConfirmButton } from "@/components/admin/FormButtons";
import { AdminPageTitle, EmptyState, Notice } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/dates";
import { GALLERY, LOGO, logoSrc, src } from "@/lib/media";
import { listMedias } from "@/lib/store/media";

import { deleteMedia } from "../../actions";

export const metadata: Metadata = { title: "Photothèque" };

/**
 * Toutes les photos envoyées depuis l'espace bénévoles. Sert surtout à faire
 * le ménage : les images s'ajoutent depuis les formulaires, au moment où on
 * en a besoin.
 */
export default async function MediasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireUser();
  const { ok } = await searchParams;
  const medias = await listMedias();

  return (
    <div className="space-y-8">
      <AdminPageTitle
        eyebrow="Le site"
        title="Photothèque"
        lead="Toutes les images du site : celles que vous avez envoyées, et celles livrées avec le site."
      />

      {ok ? <Notice tone="success">Photo supprimée.</Notice> : null}

      <section>
        <h2 className="text-[0.62rem] font-semibold tracking-[0.28em] text-charcoal/45 uppercase">
          Vos photos — {medias.length}
        </h2>
        <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-charcoal/55">
          Envoyées depuis les formulaires. Supprimer une photo la retire aussi
          des pages où elle est encore utilisée — vérifiez avant.
        </p>
      </section>

      {medias.length === 0 ? (
        <EmptyState
          title="Aucune photo envoyée"
          description="Les photos apparaissent ici dès que vous en ajoutez à une actualité, un événement ou un album."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {medias.map((media) => (
            <li
              key={media.id}
              className="overflow-hidden rounded-[3px] border border-charcoal/12 bg-cream"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.url}
                alt={media.alt}
                className="h-44 w-full object-cover"
              />
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <p className="min-w-0 text-[0.78rem] leading-tight text-charcoal/55">
                  {formatDate(media.createdAt)}
                  <br />
                  <span className="text-charcoal/35">
                    {media.width}×{media.height} ·{" "}
                    {Math.max(1, Math.round(media.bytes / 1024))} ko
                  </span>
                </p>
                <form action={deleteMedia.bind(null, media.id)}>
                  <ConfirmButton question="Supprimer définitivement cette photo ?">
                    Supprimer
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <section className="border-t border-charcoal/12 pt-8">
        <h2 className="text-[0.62rem] font-semibold tracking-[0.28em] text-charcoal/45 uppercase">
          Photos livrées avec le site — {PHOTOS_DU_SITE.length}
        </h2>
        <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-charcoal/55">
          Ces photographies font partie du site lui-même : la façade en page
          d’accueil, la salle de prière, le chantier, le logo. Elles s’affichent
          déjà sur le site et ne se suppriment pas depuis ici.
        </p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTOS_DU_SITE.map((photo) => (
            <li
              key={photo.url}
              className="overflow-hidden rounded-[3px] border border-charcoal/12"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.alt}
                className="h-44 w-full bg-sand object-cover"
              />
              <p className="px-4 py-3 text-[0.78rem] leading-snug text-charcoal/55">
                {photo.alt}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Les images qui font partie du site, hors médiathèque. */
const PHOTOS_DU_SITE = [
  ...GALLERY.map((photo) => ({ url: src(photo), alt: photo.alt })),
  { url: logoSrc(), alt: LOGO.alt },
];
