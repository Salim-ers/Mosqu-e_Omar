import "server-only";

import type { Field, ResourceDef } from "@/lib/admin/resources";
import { slugify } from "@/lib/admin/resources";
import { newId, readCollection } from "@/lib/store";
import type { ImageRef } from "@/lib/store/types";

/**
 * ============================================================================
 * FORMULAIRE → ENREGISTREMENT
 * ----------------------------------------------------------------------------
 * Traduction d'un `FormData` de l'admin en enregistrement stocké, champ par
 * champ, d'après la description de la rubrique. Rien n'est repris tel quel :
 * chaque valeur est convertie selon son type et les champs obligatoires sont
 * vérifiés ici, côté serveur.
 * ============================================================================
 */

export type AdminRecord = Record<string, unknown> & {
  id: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  order?: number;
};

export type BuildResult =
  | { ok: true; record: AdminRecord }
  | { ok: false; error: string };

function readString(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function parseImage(raw: string): ImageRef | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ImageRef>;
    if (typeof parsed?.url !== "string" || !parsed.url.startsWith("/uploads/")) {
      return null;
    }
    return {
      url: parsed.url,
      alt: typeof parsed.alt === "string" ? parsed.alt.trim() : "",
      width: typeof parsed.width === "number" ? parsed.width : undefined,
      height: typeof parsed.height === "number" ? parsed.height : undefined,
    };
  } catch {
    return null;
  }
}

function parseImages(raw: string): ImageRef[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => parseImage(JSON.stringify(item)))
      .filter((item): item is ImageRef => item !== null);
  } catch {
    return [];
  }
}

function fieldValue(field: Field, form: FormData): unknown {
  const raw = readString(form, field.name);

  switch (field.type) {
    case "boolean":
      return form.get(field.name) !== null;
    case "number": {
      const parsed = Number.parseInt(raw, 10);
      if (Number.isFinite(parsed)) return parsed;
      return typeof field.defaultValue === "number" ? field.defaultValue : 0;
    }
    case "select": {
      const allowed = field.options?.map((option) => option.value) ?? [];
      if (allowed.includes(raw)) return raw;
      return field.defaultValue ?? allowed[0] ?? "";
    }
    case "list":
      return raw
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    case "image":
      return parseImage(raw);
    case "images":
      return parseImages(raw);
    case "slug":
      return slugify(raw);
    default:
      return raw;
  }
}

function isEmpty(field: Field, value: unknown): boolean {
  if (field.type === "boolean") return false;
  if (Array.isArray(value)) return value.length === 0;
  if (value === null || value === undefined) return true;
  return String(value).trim().length === 0;
}

/** Rend un identifiant d'URL unique au sein de sa rubrique. */
async function uniqueSlug(
  def: ResourceDef,
  slug: string,
  currentId: string,
): Promise<string> {
  const list = (await readCollection(def.key)) as unknown as {
    id: string;
    slug?: string;
  }[];
  const taken = new Set(
    list.filter((item) => item.id !== currentId).map((item) => item.slug),
  );
  if (!taken.has(slug)) return slug;
  for (let suffix = 2; suffix < 100; suffix += 1) {
    const candidate = `${slug}-${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${slug}-${Date.now().toString(36)}`;
}

export async function buildRecord(
  def: ResourceDef,
  form: FormData,
  existing: AdminRecord | null,
): Promise<BuildResult> {
  const now = new Date().toISOString();
  const record: AdminRecord = {
    ...(existing ?? {}),
    id: existing?.id ?? newId(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    published: form.get("published") !== null,
  };

  if (def.sortable) {
    const order = Number.parseInt(readString(form, "order"), 10);
    record.order = Number.isFinite(order) ? order : 0;
  }

  for (const field of def.fields) {
    const value = fieldValue(field, form);

    if (field.required && isEmpty(field, value)) {
      return { ok: false, error: `Le champ « ${field.label} » est obligatoire.` };
    }

    if (field.type === "slug") {
      const source = String(value) || slugify(readString(form, field.from ?? ""));
      if (!source) {
        return {
          ok: false,
          error: "Impossible de calculer l’adresse de la page — donnez un titre.",
        };
      }
      record[field.name] = await uniqueSlug(def, source, record.id);
      continue;
    }

    record[field.name] = value;
  }

  return { ok: true, record };
}

/** Valeurs initiales d'un nouvel enregistrement. */
export function emptyRecord(def: ResourceDef): AdminRecord {
  const today = new Date().toISOString().slice(0, 10);
  const record: AdminRecord = {
    id: "",
    createdAt: "",
    updatedAt: "",
    published: true,
    order: def.sortable ? 0 : undefined,
  };

  for (const field of def.fields) {
    if (field.defaultValue !== undefined) {
      record[field.name] = field.defaultValue;
    } else if (field.type === "boolean") {
      record[field.name] = false;
    } else if (field.type === "list" || field.type === "images") {
      record[field.name] = [];
    } else if (field.type === "image") {
      record[field.name] = null;
    } else if (field.type === "number") {
      record[field.name] = 0;
    } else if (field.type === "date" && field.required) {
      record[field.name] = today;
    } else {
      record[field.name] = "";
    }
  }

  return record;
}
