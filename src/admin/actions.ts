"use server";

import { and, asc, eq, gt, lt, desc, ne, type SQL } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";
import { deleteMedia, saveUpload, setMediaAlt, UploadError } from "@/lib/media";
import { getCollection, type Collection } from "./collections";

export type FormState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTable = any;

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "item"
  );
}

async function uniqueSlug(table: AnyTable, base: string, exceptId?: number) {
  let slug = base;
  for (let i = 2; i < 100; i++) {
    const where = exceptId ? and(eq(table.slug, slug), ne(table.id, exceptId)) : eq(table.slug, slug);
    const [hit] = await db().select({ id: table.id }).from(table).where(where).limit(1);
    if (!hit) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

async function loadRow(c: Collection, id: number) {
  const t = c.table as AnyTable;
  const [row] = await db().select().from(t).where(eq(t.id, id)).limit(1);
  return (row as Record<string, unknown> | undefined) ?? null;
}

export async function saveItem(key: string, id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const c = getCollection(key);
  if (!c) return { error: "Unknown section." };
  const t = c.table as AnyTable;
  const existing = id ? await loadRow(c, id) : null;
  if (id && !existing) return { error: "This item no longer exists." };

  const values: Record<string, unknown> = {};
  const fieldErrors: Record<string, string> = {};
  const imageJobs: { name: string; file: File | null; remove: boolean; alt: string; kind: "photo" | "logo" | "screenshot" }[] = [];

  for (const f of c.fields) {
    if (f.type === "checkbox") {
      values[f.name] = formData.get(f.name) === "on";
    } else if (f.type === "category") {
      const n = Number(formData.get(f.name));
      const [cat] = Number.isInteger(n) ? await db().select({ id: schema.categories.id }).from(schema.categories).where(eq(schema.categories.id, n)).limit(1) : [];
      if (!cat) fieldErrors[f.name] = "Choose a category.";
      else values[f.name] = n;
    } else if (f.type === "image") {
      const file = formData.get(f.name);
      imageJobs.push({
        name: f.name,
        file: file instanceof File && file.size > 0 ? file : null,
        remove: formData.get(`${f.name}__remove`) === "on",
        alt: String(formData.get(`${f.name}__alt`) ?? "").trim(),
        kind: f.kind,
      });
    } else {
      const v = String(formData.get(f.name) ?? "").trim();
      if (f.required && !v) fieldErrors[f.name] = `Enter the ${f.label.toLowerCase()}.`;
      else if (v.length > f.max) fieldErrors[f.name] = `Keep this under ${f.max} characters.`;
      else if (f.type === "url" && v && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(v)) fieldErrors[f.name] = "Enter a full web address starting with https://";
      else values[f.name] = v || (f.required ? v : null);
    }
  }
  if (Object.keys(fieldErrors).length) return { error: "Please fix the highlighted fields.", fieldErrors };

  // Images: upload new files first so a failed upload changes nothing.
  const oldMedia: number[] = [];
  const newMedia: number[] = [];
  try {
    for (const job of imageJobs) {
      const current = (existing?.[job.name] as number | null | undefined) ?? null;
      if (job.file) {
        const alt = job.alt || String(values[c.titleField] ?? "");
        const mid = await saveUpload(job.file, job.kind, alt);
        newMedia.push(mid);
        values[job.name] = mid;
        if (current) oldMedia.push(current);
      } else if (job.remove && current) {
        values[job.name] = null;
        oldMedia.push(current);
      } else if (current && job.alt) {
        await setMediaAlt(current, job.alt);
      }
    }
  } catch (err) {
    await deleteMedia(newMedia);
    if (err instanceof UploadError) return { error: err.message };
    console.error("[admin] upload failed", err);
    return { error: "The image could not be saved. Try a smaller JPG or PNG." };
  }

  try {
    if (c.slugFrom && !existing) values.slug = await uniqueSlug(t, slugify(String(values[c.slugFrom])));
    if (existing) {
      await db().update(t).set(values).where(eq(t.id, id!));
    } else {
      const [last] = await db().select({ sort: t.sort }).from(t).orderBy(desc(t.sort)).limit(1);
      values.sort = ((last?.sort as number | undefined) ?? -1) + 1;
      await db().insert(t).values(values);
    }
  } catch (err) {
    await deleteMedia(newMedia);
    console.error("[admin] save failed", err);
    return { error: "Could not save. Please try again." };
  }
  await deleteMedia(oldMedia);
  revalidateTag(CONTENT_TAG);
  redirect(`/admin/${c.key}?saved=1`);
}

export async function deleteItem(key: string, id: number) {
  await requireAdmin();
  const c = getCollection(key);
  if (!c) return;
  const row = await loadRow(c, id);
  if (!row) redirect(`/admin/${key}`);
  if (key === "categories") {
    const [p] = await db().select({ id: schema.products.id }).from(schema.products).where(eq(schema.products.categoryId, id)).limit(1);
    if (p) redirect(`/admin/categories/${id}?error=has-products`);
  }
  const t = c.table as AnyTable;
  await db().delete(t).where(eq(t.id, id));
  await deleteMedia(c.fields.filter((f) => f.type === "image").map((f) => row[f.name] as number | null));
  revalidateTag(CONTENT_TAG);
  redirect(`/admin/${key}?deleted=1`);
}

/** Swap an item with its neighbour above (dir -1) or below (dir 1). Products move within their category. */
export async function moveItem(key: string, id: number, dir: -1 | 1) {
  await requireAdmin();
  const c = getCollection(key);
  if (!c) return;
  const t = c.table as AnyTable;
  const row = await loadRow(c, id);
  if (!row) return;
  const sort = row.sort as number;
  const conds: SQL[] = [dir < 0 ? lt(t.sort, sort) : gt(t.sort, sort)];
  if (c.groupByCategory) conds.push(eq(t.categoryId, row.categoryId as number));
  const [other] = await db()
    .select({ id: t.id, sort: t.sort })
    .from(t)
    .where(and(...conds))
    .orderBy(dir < 0 ? desc(t.sort) : asc(t.sort))
    .limit(1);
  if (!other) return;
  await db().update(t).set({ sort: other.sort }).where(eq(t.id, id));
  await db().update(t).set({ sort }).where(eq(t.id, other.id));
  revalidateTag(CONTENT_TAG);
}
