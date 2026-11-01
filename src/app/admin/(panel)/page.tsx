import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { AdminTitle, Notice } from "@/admin/ui";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { IS_PREVIEW } from "@/lib/config";
import { emailConfigured } from "@/lib/email";

export default async function Dashboard() {
  const me = await requireAdmin();
  const n = async (q: Promise<{ n: number }[]>) => Number((await q)[0]?.n ?? 0);
  const [pending, products, clients, reviews, recent] = await Promise.all([
    n(db().select({ n: count() }).from(schema.inquiries).where(eq(schema.inquiries.status, "pending"))),
    n(db().select({ n: count() }).from(schema.products)),
    n(db().select({ n: count() }).from(schema.clients)),
    n(db().select({ n: count() }).from(schema.testimonials)),
    db().select().from(schema.inquiries).orderBy(desc(schema.inquiries.createdAt)).limit(5),
  ]);
  const tiles = [
    { label: "New inquiries", value: pending, href: "/admin/inquiries?status=pending" },
    { label: "Products", value: products, href: "/admin/products" },
    { label: "Client logos", value: clients, href: "/admin/clients" },
    { label: "Reviews", value: reviews, href: "/admin/testimonials" },
  ];
  const fmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

  return (
    <>
      <AdminTitle title={`Welcome, ${me.name.split(" ")[0]}`} intro="Everything on the website can be changed from here. Changes appear on the site straight away." />
      {!emailConfigured() && <Notice tone="info">Email alerts are not set up yet. Inquiries are still saved here.</Notice>}
      {IS_PREVIEW && <Notice tone="info">The website is in preview mode: placeholders are shown and Google is asked not to list it.</Notice>}
      <div className="mb-8 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="grid gap-1 bg-white p-5 no-underline hover:bg-mist">
            <span className="font-head text-[28px] font-extrabold text-ink tabular-nums">{t.value}</span>
            <span className="text-[13px] text-muted">{t.label}</span>
          </Link>
        ))}
      </div>
      <h2 className="mb-3 text-[18px] font-bold">Latest inquiries</h2>
      {recent.length === 0 ? (
        <p className="text-[14px] text-muted">No inquiries yet.</p>
      ) : (
        <ul className="grid gap-px border border-line bg-line">
          {recent.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-white p-4 text-[14px]">
              <b className="font-semibold">{r.company}</b>
              <span className="text-muted">{r.name}</span>
              <span className="ml-auto text-[13px] text-muted">{fmt.format(r.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
      <Link href="/admin/inquiries" className="mt-3 inline-block text-[14px] font-semibold">
        All inquiries →
      </Link>
    </>
  );
}
