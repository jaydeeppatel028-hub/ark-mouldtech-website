"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { inquiryStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";
import * as seed from "@/content/site";

export type SettingsState = { error?: string } | undefined;

const str = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);

async function putSetting(key: string, value: unknown) {
  await db().insert(schema.settings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}

export async function saveCompany(_prev: SettingsState, fd: FormData): Promise<SettingsState> {
  await requireAdmin();
  const phoneDisplay = str(fd, "phone", 30);
  const digits = phoneDisplay.replace(/[^\d+]/g, "");
  if (!/^\+?\d{10,15}$/.test(digits)) return { error: "Enter a valid phone number." };
  const emails = (["Sales", "Design", "Gmail"] as const)
    .map((label, i) => ({ label: str(fd, `emailLabel${i}`, 30) || label, address: str(fd, `email${i}`, 150).toLowerCase(), primary: i === 0 }))
    .filter((e) => e.address);
  if (!emails.length) return { error: "Add at least one email address." };
  if (emails.some((e) => !/^\S+@\S+\.\S+$/.test(e.address))) return { error: "One of the email addresses is not valid." };
  const established = Number(str(fd, "established", 4));
  const value = {
    founder: str(fd, "founder", 100),
    established: Number.isInteger(established) && established > 1900 ? established : seed.company.established,
    phone: { display: phoneDisplay, tel: digits.startsWith("+") ? digits : `+91${digits.replace(/^0/, "")}` },
    emails,
    address: {
      line1: str(fd, "line1", 150),
      line2: str(fd, "line2", 150),
      city: str(fd, "city", 80),
      state: str(fd, "state", 80),
      country: str(fd, "country", 80) || "India",
      pincode: str(fd, "pincode", 10) || undefined,
    },
    mapQuery: str(fd, "mapQuery", 200),
    workshopArea: str(fd, "workshopArea", 40),
    intro: str(fd, "intro", 1500),
    about: str(fd, "about", 4000).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    vision: str(fd, "vision", 600),
    mission: str(fd, "mission", 600),
  };
  if (!value.address.line1 || !value.intro) return { error: "Address and company introduction cannot be empty." };
  await putSetting("company", value);
  revalidateTag(CONTENT_TAG);
  redirect("/admin/company?saved=1");
}

export async function saveSeo(_prev: SettingsState, fd: FormData): Promise<SettingsState> {
  await requireAdmin();
  const out: Record<string, { title: string; description: string; keywords: string }> = {};
  for (const page of Object.keys(seed.seo)) {
    const title = str(fd, `${page}.title`, 70);
    const description = str(fd, `${page}.description`, 170);
    if (!title || !description) return { error: "Every page needs a title and a description." };
    out[page] = { title, description, keywords: str(fd, `${page}.keywords`, 300) };
  }
  await putSetting("seo", out);
  revalidateTag(CONTENT_TAG);
  redirect("/admin/seo?saved=1");
}

export async function setInquiryStatus(id: number, fd: FormData) {
  await requireAdmin();
  const status = String(fd.get("status"));
  if (!(inquiryStatus as readonly string[]).includes(status)) return;
  await db().update(schema.inquiries).set({ status: status as (typeof inquiryStatus)[number] }).where(eq(schema.inquiries.id, id));
}

export async function deleteInquiries(ids: number[]) {
  await requireAdmin();
  const clean = ids.filter((n) => Number.isInteger(n));
  if (clean.length) await db().delete(schema.inquiries).where(inArray(schema.inquiries.id, clean));
  redirect("/admin/inquiries?deleted=1");
}
