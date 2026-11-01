import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { inquiryStatus } from "@/db/schema";
import { currentAdmin } from "@/lib/auth";

// Stops spreadsheet formulas from running when a cell starts with = + - @.
function cell(v: unknown) {
  let s = v instanceof Date ? v.toISOString().replace("T", " ").slice(0, 19) : String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  if (!(await currentAdmin())) return new Response("Unauthorized", { status: 401 });
  const status = new URL(req.url).searchParams.get("status");
  const where = status && (inquiryStatus as readonly string[]).includes(status) ? eq(schema.inquiries.status, status as (typeof inquiryStatus)[number]) : undefined;
  const rows = await db().select().from(schema.inquiries).where(where).orderBy(desc(schema.inquiries.createdAt));
  const head = ["Date (UTC)", "Status", "Name", "Company", "Address", "Pincode", "Email", "Phone", "Product", "Requirement"];
  const lines = [head.map(cell).join(",")].concat(
    rows.map((r) => [r.createdAt, r.status, r.name, r.company, r.address, r.pincode, r.email, r.phone, r.product, r.inquiry].map(cell).join(",")),
  );
  const date = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ark-inquiries-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
