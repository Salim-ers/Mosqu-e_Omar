import { ImageField, type StoredImage } from "@/components/admin/ImageField";
import { SlugField } from "@/components/admin/SlugField";
import {
  HELP_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
} from "@/components/admin/inputStyles";
import type { Field } from "@/lib/admin/resources";
import { RICHTEXT_HELP } from "@/lib/richtext";
import { cn } from "@/lib/utils";

/**
 * Rend un champ du formulaire d'après sa description. Toute la variété de
 * l'admin (texte, date, image, liste…) passe par ici : une rubrique décrite
 * dans `resources.ts` devient un formulaire complet sans code supplémentaire.
 */
export function FieldControl({
  field,
  value,
  slugPrefix,
}: {
  field: Field;
  value: unknown;
  slugPrefix?: string;
}) {
  const id = `field-${field.name}`;
  const help =
    field.type === "richtext"
      ? [field.help, `Mise en forme : ${RICHTEXT_HELP}`]
          .filter(Boolean)
          .join(" — ")
      : field.help;

  if (field.type === "boolean") {
    return (
      <div className={cn(field.full && "sm:col-span-2")}>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name={field.name}
            defaultChecked={Boolean(value)}
            className="mt-1 h-4 w-4 shrink-0 accent-[#181816]"
          />
          <span>
            <span className="text-[0.95rem] text-charcoal">{field.label}</span>
            {help ? (
              <span className="mt-1 block text-[0.8rem] leading-relaxed text-charcoal/50">
                {help}
              </span>
            ) : null}
          </span>
        </label>
      </div>
    );
  }

  return (
    <div className={cn(field.full && "sm:col-span-2")}>
      <label htmlFor={id} className={LABEL_CLASS}>
        {field.label}
        {field.required ? (
          <span aria-hidden className="ml-1 text-[#8a2a20]">
            *
          </span>
        ) : null}
      </label>
      <div className="mt-2">
        <Control field={field} value={value} id={id} slugPrefix={slugPrefix} />
      </div>
      {help ? <p className={HELP_CLASS}>{help}</p> : null}
    </div>
  );
}

function Control({
  field,
  value,
  id,
  slugPrefix,
}: {
  field: Field;
  value: unknown;
  id: string;
  slugPrefix?: string;
}) {
  const text = typeof value === "string" ? value : "";

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          id={id}
          name={field.name}
          required={field.required}
          rows={4}
          defaultValue={text}
          placeholder={field.placeholder}
          className={cn(INPUT_CLASS, "min-h-28 leading-relaxed")}
        />
      );

    case "richtext":
      return (
        <textarea
          id={id}
          name={field.name}
          required={field.required}
          rows={16}
          defaultValue={text}
          placeholder={field.placeholder}
          className={cn(INPUT_CLASS, "min-h-[22rem] leading-[1.7]")}
        />
      );

    case "list":
      return (
        <textarea
          id={id}
          name={field.name}
          required={field.required}
          rows={5}
          defaultValue={Array.isArray(value) ? value.join("\n") : ""}
          placeholder={field.placeholder}
          className={cn(INPUT_CLASS, "min-h-32 leading-relaxed")}
        />
      );

    case "select":
      return (
        <select
          id={id}
          name={field.name}
          defaultValue={text || String(field.defaultValue ?? "")}
          className={INPUT_CLASS}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case "number":
      return (
        <input
          id={id}
          type="number"
          name={field.name}
          defaultValue={typeof value === "number" ? value : ""}
          className={INPUT_CLASS}
        />
      );

    case "date":
      return (
        <input
          id={id}
          type="date"
          name={field.name}
          required={field.required}
          defaultValue={text.slice(0, 10)}
          className={INPUT_CLASS}
        />
      );

    case "datetime":
      return (
        <input
          id={id}
          type="datetime-local"
          name={field.name}
          required={field.required}
          defaultValue={text.slice(0, 16)}
          className={INPUT_CLASS}
        />
      );

    case "slug":
      return (
        <SlugField
          name={field.name}
          from={field.from ?? "title"}
          initial={text}
          prefix={slugPrefix ?? "/"}
        />
      );

    case "image":
      return (
        <ImageField
          name={field.name}
          initial={value ? [value as StoredImage] : []}
        />
      );

    case "images":
      return (
        <ImageField
          name={field.name}
          multiple
          initial={Array.isArray(value) ? (value as StoredImage[]) : []}
        />
      );

    default:
      return (
        <input
          id={id}
          type="text"
          name={field.name}
          required={field.required}
          defaultValue={text}
          placeholder={field.placeholder}
          className={INPUT_CLASS}
        />
      );
  }
}
