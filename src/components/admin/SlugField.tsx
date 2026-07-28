"use client";

import { useEffect, useState } from "react";

import { INPUT_CLASS } from "@/components/admin/inputStyles";
import { slugify } from "@/lib/admin/resources";

/**
 * Adresse de la page. Tant que le bénévole n'y touche pas, elle suit le titre
 * saisi juste au-dessus ; dès qu'il la modifie, elle reste telle quelle (une
 * adresse déjà publiée ne doit pas bouger toute seule).
 */
export function SlugField({
  name,
  from,
  initial,
  prefix,
}: {
  name: string;
  from: string;
  initial: string;
  prefix: string;
}) {
  const [value, setValue] = useState(initial);
  const [locked, setLocked] = useState(initial.length > 0);

  useEffect(() => {
    if (locked) return;
    const source = document.querySelector<HTMLInputElement>(
      `[name="${CSS.escape(from)}"]`,
    );
    if (!source) return;

    const sync = () => setValue(slugify(source.value));
    source.addEventListener("input", sync);
    return () => source.removeEventListener("input", sync);
  }, [from, locked]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-[0.85rem] text-charcoal/45">{prefix}</span>
        <input
          type="text"
          name={name}
          value={value}
          onChange={(event) => {
            setLocked(true);
            setValue(event.target.value);
          }}
          className={INPUT_CLASS}
        />
      </div>
    </div>
  );
}
