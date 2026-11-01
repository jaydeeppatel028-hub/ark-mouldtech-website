import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { deleteInquiries, setInquiryStatus } from "@/admin/settings-actions";
import { AdminTitle, Notice } from "@/admin/ui";
import { db, schema } from "@/db";
import { inquiryStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

const PER_PAGE = 50;
const LABEL: Record<string, string> = { pending: "Pending", contacted: "Contacted", completed: "Completed" };
const CHIP: Record<string, string> = { pending: "bg-amber-100 text-amber-900", contacted: "bg-blue-100 text-blue-900", completed: "bg-green-100 text-green-900" };

async function bulkDelete(fd: FormData) {
  "use server";
  await deleteInquiries(fd.getAll("ids").map(Number));
}

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = (inquiryStatus as readonly string[]).includes(sp.status) ? (sp.status as (typeof inquiryStatus)[number]) : null;
  const page = Math.max(1, Number(sp.page) || 1);
  const where = status ? eq(schema.inquiries.status, status) : undefined;
  const [rows, [{ n }]] = await Promise.all([
    db().select().from(schema.inquiries).where(where).orderBy(desc(schema.inquiries.createdAt), desc(schema.inquiries.id)).limit(PER_PAGE).offset((page - 1) * PER_PAGE),
    db().select({ n: count() }).from(schema.inquiries).where(where),
  ]);
  const pages = Math.max(1, Math.ceil(Number(n) / PER_PAGE));
  const fmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
  const q = (extra: Record<string, string | number>) => `?${new URLSearchParams({ ...(status ? { status } : {}), ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])) })}`;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <AdminTitle title="Inquiries" intro="Messages sent from the Contact form, newest first." />
        <a href={`/admin/inquiries/export${status ? `?status=${status}` : ""}`} className="btn btn-dark mb-6">
          Download for Excel (CSV)
        </a>
      </div>
      {sp.deleted && <Notice>Deleted.</Notice>}
      <div className="mb-4 flex flex-wrap gap-2">
        {[null, ...inquiryStatus].map((s) => (
          <Link key={s ?? "all"} href={s ? `?status=${s}` : "/admin/inquiries"} className={`border px-3 py-1.5 text-[13px] font-semibold no-underline ${s === status ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}>
            {s ? LABEL[s] : "All"}
          </Link>
        ))}
      </div>
      {rows.length === 0 ? (
        <Notice tone="info">No inquiries {status ? `marked ${LABEL[status].toLowerCase()}` : "yet"}.</Notice>
      ) : (
        <>
          <form id="bulk" action={bulkDelete} />
          <ul className="grid gap-3">
            {rows.map((r) => (
              <li key={r.id} className="border border-line bg-white">
                <details>
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 p-4">
                    <input type="checkbox" name="ids" value={r.id} form="bulk" aria-label={`Select inquiry from ${r.name}`} className="h-4 w-4" />
                    <span className={`px-2 py-0.5 text-[12px] font-semibold ${CHIP[r.status]}`}>{LABEL[r.status]}</span>
                    <b className="font-semibold text-ink">{r.company}</b>
                    <span className="text-[14px] text-muted">{r.name}</span>
                    {r.product && <span className="text-[13px] text-brand-blue">{r.product}</span>}
                    <span className="ml-auto text-[13px] text-muted tabular-nums">{fmt.format(r.createdAt)}</span>
                  </summary>
                  <div className="grid gap-4 border-t border-line p-4 md:grid-cols-[1fr_260px]">
                    <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-[14px]">
                      <dt className="text-muted">Phone</dt>
                      <dd><a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}>{r.phone}</a></dd>
                      <dt className="text-muted">Email</dt>
                      <dd className="break-all"><a href={`mailto:${r.email}`}>{r.email}</a></dd>
                      <dt className="text-muted">Address</dt>
                      <dd>{r.address}, {r.pincode}</dd>
                      <dt className="text-muted">Requirement</dt>
                      <dd className="whitespace-pre-wrap text-ink">{r.inquiry}</dd>
                      <dt className="text-muted">Email alert</dt>
                      <dd>{r.emailSent ? "Sent" : "Not sent"}</dd>
                    </dl>
                    <form action={setInquiryStatus.bind(null, r.id)} className="grid content-start gap-2">
                      <label htmlFor={`st-${r.id}`} className="text-[13px] font-semibold">Status</label>
                      <select id={`st-${r.id}`} name="status" defaultValue={r.status} className="border border-[#cdd1d8] bg-white px-3 py-2">
                        {inquiryStatus.map((s) => (
                          <option key={s} value={s}>{LABEL[s]}</option>
                        ))}
                      </select>
                      <button type="submit" className="btn btn-dark">Update status</button>
                    </form>
                  </div>
                </details>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <button type="submit" form="bulk" className="btn border-brand-red text-brand-red hover:bg-brand-red hover:text-white">
              Delete selected
            </button>
            {pages > 1 && (
              <div className="flex items-center gap-3 text-[14px]">
                {page > 1 && <Link href={q({ page: page - 1 })}>← Newer</Link>}
                <span>Page {page} of {pages}</span>
                {page < pages && <Link href={q({ page: page + 1 })}>Older →</Link>}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
