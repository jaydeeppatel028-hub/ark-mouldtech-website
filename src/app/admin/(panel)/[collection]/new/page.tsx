import { asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { saveItem } from "@/admin/actions";
import { getCollection } from "@/admin/collections";
import { ItemForm } from "@/admin/ItemForm";
import { AdminTitle } from "@/admin/ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";

export default async function NewItem({ params }: { params: Promise<{ collection: string }> }) {
  await requireAdmin();
  const { collection } = await params;
  const c = getCollection(collection);
  if (!c) notFound();
  const categories = c.fields.some((f) => f.type === "category")
    ? await db().select({ id: schema.categories.id, name: schema.categories.name }).from(schema.categories).orderBy(asc(schema.categories.sort))
    : [];
  return (
    <>
      <AdminTitle title={`Add ${c.singular}`} />
      <ItemForm fields={c.fields} values={{}} images={{}} categories={categories} action={saveItem.bind(null, c.key, null)} cancelHref={`/admin/${c.key}`} submitLabel={`Add ${c.singular}`} />
    </>
  );
}
