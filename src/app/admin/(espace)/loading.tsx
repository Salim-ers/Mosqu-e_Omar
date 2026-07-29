/**
 * Squelette affiché pendant qu'une rubrique se charge. Sans lui, changer de
 * rubrique laisse l'écran figé sur la page précédente le temps de l'aller-
 * retour avec la base : on ne sait pas si le clic a été pris en compte.
 */
export default function ChargementEspace() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="border-b border-charcoal/12 pb-7">
        <div className="skeleton h-3 w-24 rounded-[2px]" />
        <div className="skeleton mt-4 h-9 w-64 rounded-[2px]" />
        <div className="skeleton mt-4 h-4 w-full max-w-xl rounded-[2px]" />
      </div>
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-20 w-full rounded-[3px]" />
        ))}
      </div>
      <p className="sr-only">Chargement…</p>
    </div>
  );
}
