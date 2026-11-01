"use server";

import { eq } from "drizzle-orm";
import { db, hasDatabase, schema } from "@/db";
import { clientIp } from "@/lib/client-ip";
import { getCompany } from "@/lib/content";
import { emailConfigured, sendMail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { firstErrors, inquirySchema, type InquiryState } from "@/lib/validation";

const SUCCESS_MESSAGE =
  "Thank you for contacting ARK MOULDTECH SOLUTIONS. Your inquiry has been received successfully. Our team will get in touch with you shortly.";

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  // Spam traps: a hidden field people never fill, and a minimum time on the form.
  if (String(formData.get("website") ?? "") !== "") return { status: "success", message: SUCCESS_MESSAGE };
  const started = Number(formData.get("startedAt") ?? 0);
  if (!started || Date.now() - started < 3000) {
    return { status: "error", message: "That was very fast. Please check your details and send again." };
  }

  const ip = await clientIp();
  if (!(await rateLimit(`inquiry:${ip}`, 5, 10 * 60 * 1000))) {
    return { status: "error", message: "Too many inquiries from your connection. Please wait a few minutes or call us." };
  }

  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please correct the highlighted fields.", fieldErrors: firstErrors(parsed.error) };
  }
  const d = parsed.data;

  let savedId: number | null = null;
  if (hasDatabase()) {
    try {
      const [res] = await db()
        .insert(schema.inquiries)
        .values({ ...d, product: d.product || null, ip })
        .$returningId();
      savedId = res?.id ?? null;
    } catch (err) {
      console.error("[inquiry] database save failed", err);
    }
  }

  let emailed = false;
  if (emailConfigured()) {
    try {
      const company = await getCompany();
      const to = process.env.INQUIRY_TO || company.emails.find((e) => e.primary)?.address || company.emails[0]?.address;
      if (to) {
        await sendMail({
          to,
          replyTo: d.email,
          subject: `New website inquiry from ${d.company}${d.product ? ` (${d.product})` : ""}`,
          rows: [
            ["Name", d.name],
            ["Company", d.company],
            ["Address", d.address],
            ["Pincode", d.pincode],
            ["Email", d.email],
            ["Phone", d.phone],
            ...(d.product ? ([["Product", d.product]] as [string, string][]) : []),
            ["Requirement", d.inquiry],
          ],
        });
        emailed = true;
      }
    } catch (err) {
      console.error("[inquiry] email failed", err);
    }
    if (emailed && savedId && hasDatabase()) {
      await db().update(schema.inquiries).set({ emailSent: true }).where(eq(schema.inquiries.id, savedId));
    }
  }

  if (!hasDatabase() && !emailConfigured()) {
    // Local preview: neither the database nor email is set up. Say so honestly.
    console.warn("[inquiry] not stored or emailed: DATABASE_URL and SMTP settings are missing");
    return { status: "success", message: `${SUCCESS_MESSAGE} (Preview: the form is not connected to a database or email yet, so nothing was saved.)` };
  }
  if (!savedId && !emailed) return { status: "error", message: "Sorry, we could not send your inquiry. Please call us instead." };
  return { status: "success", message: SUCCESS_MESSAGE };
}
