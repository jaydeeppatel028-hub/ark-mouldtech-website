"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitKeepingValues } from "@/lib/submit-keeping-values";
import { submitInquiry } from "@/lib/inquiry-action";
import { inquirySchema, firstErrors, type InquiryField, type InquiryState } from "@/lib/validation";
import { Icon } from "./Icon";

const FIELDS: { name: InquiryField; label: string; type?: string; autoComplete?: string; inputMode?: "numeric" | "tel" | "email"; wide?: boolean; textarea?: boolean }[] = [
  { name: "name", label: "Name", autoComplete: "name" },
  { name: "company", label: "Company Name", autoComplete: "organization" },
  { name: "address", label: "Company Address", autoComplete: "street-address", wide: true },
  { name: "pincode", label: "Pincode", autoComplete: "postal-code", inputMode: "numeric" },
  { name: "phone", label: "Contact Number", type: "tel", autoComplete: "tel", inputMode: "tel" },
  { name: "email", label: "Email Address", type: "email", autoComplete: "email", inputMode: "email", wide: true },
  { name: "inquiry", label: "Inquiry / Requirement", wide: true, textarea: true },
];

export function InquiryForm({ product }: { product?: string }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: "idle" });
  const [errors, setErrors] = useState<Partial<Record<InquiryField, string>>>({});
  const [startedAt, setStartedAt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => setStartedAt(Date.now()), []);
  useEffect(() => {
    if (state.status === "error" && state.fieldErrors) setErrors(state.fieldErrors);
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  function check(form: HTMLFormElement, only?: InquiryField) {
    const data = Object.fromEntries(new FormData(form));
    const result = inquirySchema.safeParse(data);
    const next = result.success ? {} : firstErrors(result.error);
    if (only) setErrors((e) => ({ ...e, [only]: next[only] }));
    else setErrors(next);
    return result.success;
  }

  if (state.status === "success") {
    return (
      <div role="status" className="grid gap-4 border border-line bg-white p-8">
        <div className="grid h-12 w-12 place-items-center bg-brand-blue text-white">
          <Icon name="check" className="h-6 w-6" strokeWidth={2.4} />
        </div>
        <p className="text-[17px] text-ink">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      onSubmit={(e) => {
        if (!check(e.currentTarget)) {
          e.preventDefault();
          const first = e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
          first?.focus();
          return;
        }
        // Keeps what the visitor typed if the server says something is wrong.
        submitKeepingValues(e, action);
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      {FIELDS.map((f) => {
        const err = errors[f.name];
        const id = `inq-${f.name}`;
        const common = {
          id,
          name: f.name,
          required: true,
          autoComplete: f.autoComplete,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${id}-err` : undefined,
          onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.currentTarget.form && check(e.currentTarget.form, f.name),
        } as const;
        return (
          <div key={f.name} className={`field ${f.wide ? "sm:col-span-2" : ""}`} data-invalid={err ? "true" : undefined}>
            <label htmlFor={id}>
              {f.label} <span className="text-brand-red">*</span>
            </label>
            {f.textarea ? (
              <textarea {...common} defaultValue={product ? `Inquiry about: ${product}\n\n` : undefined} />
            ) : (
              <input {...common} type={f.type ?? "text"} inputMode={f.inputMode} />
            )}
            {err && (
              <span id={`${id}-err`} className="err">
                {err}
              </span>
            )}
          </div>
        );
      })}

      {product && <input type="hidden" name="product" value={product} />}
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Spam trap: hidden from people, filled in by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="inq-website">Website</label>
        <input id="inq-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-[14px] text-brand-red-dark sm:col-span-2">
          {state.message}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className="btn btn-red" disabled={pending}>
          {pending ? "Sending…" : "Send Inquiry"}
        </button>
        <span className="text-[13px] text-muted">All fields are required.</span>
      </div>
    </form>
  );
}
