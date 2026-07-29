import { ConfirmButton } from "@/components/admin/FormButtons";
import { EmptyState } from "@/components/admin/ui";
import { formatDate } from "@/lib/dates";
import { GALLERY, LOGO, logoSrc, src } from "@/lib/media";
import { listMedias } from "@/lib/store/media";

import { deleteMedia } from "@/app/admin/actions";

/**
 * Toutes les images du site, à la suite des albums : celles envoyées par
 * l'équipe, puis celles livrées avec le site. Placée ici plutôt que dans une
 * rubrique à part, parce que c'est en travaillant ses albums qu'on a besoin de
 * voir et de faire le ménage dans ses photos.
 */
export async function Phototheque() {
  const medias = await listMedias();

  return (
    <div className="space-y-10 border-t border-charcoal/12 pt-10">
      <section>
        <h2 className="font-display text-2xl font-medium text-charcoal">
          Photothèque — {medias.length} photo{medias.length > 1 ? "s" : ""}
        </h2>
        <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-charcoal/60">
          Toutes les photos que vous avez envoyées, tous albums confondus.
          Supprimer une photo la retire aussi des pages où elle est encore
          utilisée — vérifiez avant.
        </p>

        {medias.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="Aucune photo envoyée"
              description="Les photos apparaissent ici dès que vous en ajoutez à un album, une actualité ou un événement."
            />
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {medias.map((media) => (
              <li
                key={media.id}
                className="overflow-hidden rounded-[3px] border border-charcoal/12 bg-cream"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.url}
                  alt={media.alt}
                  className="h-44 w-full bg-sand object-cover"
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
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium text-charcoal">
          Photos livrées avec le site — {PHOTOS_DU_SITE.length}
        </h2>
        <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-charcoal/60">
          La façade en page d’accueil, la salle de prière, le chantier, le logo.
          Elles font partie du site lui-même et ne se suppriment pas d’ici — pour
          montrer l’avancée des travaux, créez plutôt un album avec vos propres
          photos : il s’affichera avant celles-ci dans la galerie.
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

/** Les images qui font partie du site, hors photothèque. */
const PHOTOS_DU_SITE = [
  ...GALLERY.map((photo) => ({ url: src(photo), alt: photo.alt })),
  { url: logoSrc(), alt: LOGO.alt },
];
