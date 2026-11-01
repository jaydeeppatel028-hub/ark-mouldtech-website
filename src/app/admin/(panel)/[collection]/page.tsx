import { asc } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { moveItem } from "@/admin/actions";
import { getCollection } from "@/admin/collections";
import { AdminTitle, Notice } from "@/admin/ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";

type Row = Record<string, unknown> & { id: number; sort: number };

export default async function CollectionList({ params, searchParams }: { params: Promise<{ collection: string }>; searchParams: Promise<Record<string, string>> }) {
  await requireAdmin();
  const { collection } = await params;
  const sp = await searchParams;
  const c = getCollection(collection);
  if (!c) notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = c.table as any;
  const rows = (await db().select().from(t).orderBy(asc(t.sort), asc(t.id))) as Row[];
  const cats = c.groupByCategory ? await db().select().from(schema.categories).orderBy(asc(schema.categories.sort)) : [];
  const groups = c.groupByCategory
    ? cats.map((cat) => ({ title: cat.name, rows: rows.filter((r) => r.categoryId === cat.id) }))
    : [{ title: "", rows }];

  return (
    <>
      <AdminTitle title={c.title} intro={c.intro} action={{ href: `/admin/${c.key}/new`, label: `Add ${c.singular}` }} />
      {sp.saved && <Notice>Saved. The website shows the change straight away.</Notice>}
      {sp.deleted && <Notice>Deleted.</Notice>}
      {rows.length === 0 && <Notice tone="info">Nothing here yet. Use “Add {c.singular}” to create the first one.</Notice>}
      <div className="grid gap-8">
        {groups.map((g) => (
          <section key={g.title || "all"} className="grid gap-2">
            {g.title && <h2 className="text-[16px] font-bold">{g.title}</h2>}
            {g.rows.length === 0 && g.title && <p className="text-[14px] text-muted">No products in this category.</p>}
            <ul className="grid gap-px border border-line bg-line">
              {g.rows.map((r, i) => {
                const thumb = c.thumbField ? (r[c.thumbField] as number | null) : null;
                const sub = c.subtitle?.(r);
                return (
                  <li key={r.id} className="flex items-center gap-3 bg-white p-3">
                    {c.thumbField && (
                      <div className="grid h-14 w-16 flex-none place-items-center overflow-hidden bg-mist">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`/media/${thumb}`} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
                        ) : (
                          <span className="text-[10px] text-muted">No image</span>
                        )}
                      </div>
                    )}
                    <Link href={`/admin/${c.key}/${r.id}`} className="min-w-0 flex-1 text-ink no-underline hover:text-brand-blue">
                      <b className="block truncate font-semibold">{String(r[c.titleField])}</b>
                      {sub && <span className="block truncate text-[13px] text-muted">{sub}</span>}
                    </Link>
                    <div className="flex flex-none items-center gap-1">
                      <form action={moveItem.bind(null, c.key, r.id, -1)}>
                        <button type="submit" disabled={i === 0} aria-label="Move up" className="grid h-9 w-9 place-items-center border border-line disabled:opacity-30">
                          ↑
                        </button>
                      </form>
                      <form action={moveItem.bind(null, c.key, r.id, 1)}>
                        <button type="submit" disabled={i === g.rows.length - 1} aria-label="Move down" className="grid h-9 w-9 place-items-center border border-line disabled:opacity-30">
                          ↓
                        </button>
                      </form>
                      <Link href={`/admin/${c.key}/${r.id}`} className="ml-1 border border-line px-3 py-1.5 text-[13px] font-semibold text-ink no-underline">
                        Edit
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
