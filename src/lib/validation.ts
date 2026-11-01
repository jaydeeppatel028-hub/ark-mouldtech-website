import { z } from "zod";

// Zod normally probes for eval() to speed up validation. The Content-Security-Policy
// forbids eval, so turn that off instead of triggering a policy violation.
z.config({ jitless: true });

const clean = (v: string) => v.replace(/[\s\-().]/g, "");

/** Shared by the browser (instant feedback) and the server (the real check). */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  company: z.string().trim().min(2, "Please enter your company name.").max(150, "Company name is too long."),
  address: z.string().trim().min(5, "Please enter your company address.").max(300, "Address is too long."),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(150),
  phone: z
    .string()
    .trim()
    .refine((v) => /^\+?[0-9]{10,15}$/.test(clean(v)), "Enter a valid contact number with at least 10 digits."),
  inquiry: z.string().trim().min(10, "Please describe your requirement (at least 10 characters).").max(3000, "Please keep it under 3,000 characters."),
  product: z.string().trim().max(150).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryField = keyof InquiryInput;

export type InquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<InquiryField, string>> }
  | { status: "success"; message: string };

export function firstErrors(error: z.ZodError): Partial<Record<InquiryField, string>> {
  const out: Partial<Record<InquiryField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as InquiryField;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
