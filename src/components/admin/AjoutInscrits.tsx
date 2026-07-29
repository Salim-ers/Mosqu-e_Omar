"use client";

import { useState } from "react";

import { SubmitButton } from "@/components/admin/FormButtons";
import { INPUT_CLASS, LABEL_CLASS } from "@/components/admin/inputStyles";
import { ajouterInscrit, importerInscrits } from "@/app/admin/actions";

/**
 * Deux façons d'inscrire quelqu'un sans passer par le site : à la main, pour
 * la personne qui s'est présentée à l'accueil, ou en important la liste déjà
 * tenue dans un tableur. Les deux replient leur formulaire tant qu'on ne s'en
 * sert pas : la page reste la liste des inscrits.
 */
export function AjoutInscrits({ cours }: { cours: string }) {
  const [ouvert, setOuvert] = useState<"aucun" | "manuel" | "csv">("aucun");

  const onglet = (cle: "manuel" | "csv", libelle: string) => (
    <button
      type="button"
      onClick={() => setOuvert(ouvert === cle ? "aucun" : cle)}
      aria-expanded={ouvert === cle}
      className={`rounded-[2px] border px-5 py-2.5 text-[0.7rem] font-semibold tracking-[0.16em] uppercase transition-colors ${
        ouvert === cle
          ? "border-ink bg-ink text-ivory"
          : "border-charcoal/20 text-charcoal hover:border-ink hover:bg-ink hover:text-ivory"
      }`}
    >
      {libelle}
    </button>
  );

  return (
    <div className="rounded-[3px] border border-charcoal/12 bg-cream p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        {onglet("manuel", "Ajouter un inscrit")}
        {onglet("csv", "Importer une liste")}
      </div>

      {ouvert === "manuel" ? (
        <form
          action={ajouterInscrit.bind(null, cours)}
          className="mt-7 grid gap-6 sm:grid-cols-2"
        >
          <div>
            <label htmlFor="prenom" className={LABEL_CLASS}>
              Prénom
            </label>
            <input
              id="prenom"
              name="prenom"
              type="text"
              required
              className={`${INPUT_CLASS} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="nom" className={LABEL_CLASS}>
              Nom
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              required
              className={`${INPUT_CLASS} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="age" className={LABEL_CLASS}>
              Âge ou niveau
            </label>
            <input
              id="age"
              name="age"
              type="text"
              placeholder="9 ans, CM2, adulte…"
              className={`${INPUT_CLASS} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="contactNom" className={LABEL_CLASS}>
              Parent ou responsable
            </label>
            <input
              id="contactNom"
              name="contactNom"
              type="text"
              className={`${INPUT_CLASS} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="telephone" className={LABEL_CLASS}>
              Téléphone
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
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
              className={`${INPUT_CLASS} mt-2`}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className={LABEL_CLASS}>
              Remarque
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className={`${INPUT_CLASS} mt-2 min-h-24 leading-relaxed`}
            />
          </div>
          <div className="sm:col-span-2">
            <SubmitButton pendingLabel="Ajout…">Ajouter à la liste</SubmitButton>
          </div>
        </form>
      ) : null}

      {ouvert === "csv" ? (
        <form action={importerInscrits.bind(null, cours)} className="mt-7 space-y-5">
          <div>
            <label htmlFor="fichier" className={LABEL_CLASS}>
              Fichier CSV
            </label>
            <input
              id="fichier"
              name="fichier"
              type="file"
              accept=".csv,text/csv"
              required
              className={`${INPUT_CLASS} mt-2 file:mr-4 file:rounded-[2px] file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[0.7rem] file:font-semibold file:tracking-[0.14em] file:text-ivory file:uppercase`}
            />
          </div>

          <div className="rounded-[2px] border border-charcoal/12 bg-ivory p-5">
            <p className="text-[0.66rem] font-semibold tracking-[0.2em] text-charcoal/50 uppercase">
              Colonnes attendues
            </p>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-charcoal/70">
              Une ligne par personne, avec une première ligne d’intitulés :
            </p>
            <pre className="mt-3 overflow-x-auto rounded-[2px] bg-cream p-3 text-[0.78rem] leading-relaxed text-charcoal/75">
{`Prénom;Nom;Âge;Responsable;Téléphone;Email;Remarque
Yassine;Benali;9 ans;Karim Benali;06 12 34 56 78;;
Maryam;Haddad;CM2;Sara Haddad;06 98 76 54 32;sara@exemple.fr;`}
            </pre>
            <p className="mt-3 text-[0.82rem] leading-relaxed text-charcoal/55">
              L’ordre des colonnes n’a pas d’importance et toutes ne sont pas
              obligatoires — seuls le prénom et le nom comptent. Le
              point-virgule d’Excel comme la virgule sont acceptés, les accents
              aussi. Les lignes vides sont ignorées.
            </p>
          </div>

          <SubmitButton pendingLabel="Import en cours…">
            Importer la liste
          </SubmitButton>
        </form>
      ) : null}
    </div>
  );
}
