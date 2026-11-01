"use server";

import { headers } from "next/headers";
import { IS_PREVIEW } from "@/lib/config";
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

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (!rateLimit(`inquiry:${ip}`)) {
    return { status: "error", message: "Too many inquiries from your connection. Please wait a few minutes or call us." };
  }

  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please correct the highlighted fields.", fieldErrors: firstErrors(parsed.error) };
  }

  // Step 3: save to MySQL and email the sales inbox here.
  console.info("[inquiry] received (not yet stored):", { company: parsed.data.company, product: parsed.data.product });

  return {
    status: "success",
    message: IS_PREVIEW ? `${SUCCESS_MESSAGE} (Preview: this form is not connected yet, so nothing was sent.)` : SUCCESS_MESSAGE,
  };
}
