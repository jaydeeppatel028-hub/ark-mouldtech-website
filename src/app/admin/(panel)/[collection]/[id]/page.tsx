import { asc, eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { deleteItem, saveItem } from "@/admin/actions";
import { getCollection } from "@/admin/collections";
import { DeleteButton } from "@/admin/DeleteButton";
import { ItemForm } from "@/admin/ItemForm";
import { AdminTitle, Notice } from "@/admin/ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";

export default async function EditItem({ params, searchParams }: { params: Promise<{ collection: string; id: string }>; searchParams: Promise<Record<string, string>> }) {
  await requireAdmin();
  const { collection, id } = await params;
  const sp = await searchParams;
  const c = getCollection(collection);
  const num = Number(id);
  if (!c || !Number.isInteger(num)) notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = c.table as any;
  const [row] = (await db().select().from(t).where(eq(t.id, num)).limit(1)) as Record<string, unknown>[];
  if (!row) notFound();

  const imageFields = c.fields.filter((f) => f.type === "image");
  const ids = imageFields.map((f) => row[f.name]).filter((v): v is number => typeof v === "number");
  const media = ids.length ? await db().select({ id: schema.media.id, alt: schema.media.alt }).from(schema.media).where(inArray(schema.media.id, ids)) : [];
  const images = Object.fromEntries(imageFields.map((f) => [f.name, media.find((m) => m.id === row[f.name]) ?? null]));
  const categories = c.fields.some((f) => f.type === "category")
    ? await db().select({ id: schema.categories.id, name: schema.categories.name }).from(schema.categories).orderBy(asc(schema.categories.sort))
    : [];
  // Drop binary or non-form columns before sending values to the browser.
  const values = Object.fromEntries(c.fields.filter((f) => f.type !== "image").map((f) => [f.name, row[f.name]]));

  return (
    <>
      <AdminTitle title={`Edit ${c.singular}`} intro={String(row[c.titleField])} />
      {sp.error === "has-products" && <Notice tone="error">This category still has products. Move or delete them first.</Notice>}
      <ItemForm fields={c.fields} values={values} images={images} categories={categories} action={saveItem.bind(null, c.key, num)} cancelHref={`/admin/${c.key}`} submitLabel="Save changes" />
      <div className="mt-10 max-w-3xl border-t border-line pt-6">
        <DeleteButton action={deleteItem.bind(null, c.key, num)} label={`Delete this ${c.singular}`} />
      </div>
    </>
  );
}
