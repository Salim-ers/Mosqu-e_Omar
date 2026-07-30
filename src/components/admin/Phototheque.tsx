import { AjoutPhotos } from "@/components/admin/AjoutPhotos";
import { ConfirmButton, SubmitButton } from "@/components/admin/FormButtons";
import { EmptyState, StatusPill } from "@/components/admin/ui";
import { RemplacerPhotoLivree } from "@/components/admin/PhotoLivreeActions";
import { formatDate } from "@/lib/dates";
import { getPhotosLivrees } from "@/lib/content";
import { listMedias } from "@/lib/store/media";

import {
  deleteMedia,
  masquerPhotoSite,
  reinitialiserPhotoSite,
} from "@/app/admin/actions";

/**
 * Toutes les images du site, à la suite des albums : celles envoyées par
 * l'équipe, puis celles livrées avec le site. Placée ici plutôt que dans une
 * rubrique à part, parce que c'est en travaillant ses albums qu'on a besoin de
 * voir et de faire le ménage dans ses photos.
 *
 * Les photographies livrées vivent dans le code : un navigateur ne peut pas
 * effacer un fichier du dépôt. Chacune peut en revanche être remplacée par une
 * photo de la mosquée, et celles de la galerie peuvent en être retirées. Le
 * fichier d'origine reste en place, si bien qu'un retour en arrière ne coûte
 * qu'un clic.
 */
export async function Phototheque() {
  const [medias, livrees] = await Promise.all([listMedias(), getPhotosLivrees()]);

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

        <AjoutPhotos />

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
          Photos livrées avec le site — {livrees.length}
        </h2>
        <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-charcoal/60">
          La façade de l’accueil, la salle de prière, le chantier, le logo. Elles
          font partie du site lui-même, donc elles ne s’effacent pas — mais vous
          pouvez <strong>remplacer</strong> chacune par une photo de la mosquée,
          et <strong>retirer</strong> de la galerie celles qui n’ont plus lieu
          d’y être. L’originale reste conservée : « Remettre l’originale » annule
          tout.
        </p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {livrees.map((photo) => (
            <li
              key={photo.cle}
              className={`overflow-hidden rounded-[3px] border ${
                photo.masquee
                  ? "border-charcoal/12 bg-transparent"
                  : "border-charcoal/12 bg-cream"
              }`}
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className={`h-44 w-full bg-sand object-cover ${
                    photo.masquee ? "opacity-35 grayscale" : ""
                  }`}
                />
              </div>

              <div className="space-y-3 px-4 py-4">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.62rem] font-semibold tracking-[0.18em] text-charcoal/45 uppercase">
                    {photo.usage}
                  </span>
                  {photo.remplacee ? (
                    <StatusPill published labels={["Remplacée", ""]} />
                  ) : null}
                  {photo.masquee ? (
                    <StatusPill published={false} labels={["", "Retirée"]} />
                  ) : null}
                </p>

                <p className="text-[0.8rem] leading-snug text-charcoal/60">
                  {photo.alt}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <RemplacerPhotoLivree
                    cle={photo.cle}
                    libelle={photo.remplacee ? "Changer" : "Remplacer"}
                  />

                  {photo.masquable ? (
                    <form
                      action={masquerPhotoSite.bind(null, photo.cle, !photo.masquee)}
                    >
                      <SubmitButton variant="ghost" pendingLabel="…">
                        {photo.masquee ? "Remettre en galerie" : "Retirer du site"}
                      </SubmitButton>
                    </form>
                  ) : null}

                  {photo.remplacee || photo.masquee ? (
                    <form action={reinitialiserPhotoSite.bind(null, photo.cle)}>
                      <SubmitButton variant="danger" pendingLabel="…">
                        Remettre l’originale
                      </SubmitButton>
                    </form>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
