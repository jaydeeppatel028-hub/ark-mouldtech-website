"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { FormState } from "./actions";

type Field =
  | { name: string; label: string; type: "text" | "textarea" | "url"; required?: boolean; max: number; help?: string; rows?: number }
  | { name: string; label: string; type: "checkbox"; help?: string }
  | { name: string; label: string; type: "category"; required: true }
  | { name: string; label: string; type: "image"; kind: string; help?: string };

type Props = {
  fields: Field[];
  values: Record<string, unknown>;
  images: Record<string, { id: number; alt: string } | null>;
  categories: { id: number; name: string }[];
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  cancelHref: string;
  submitLabel: string;
};

function ImageField({ field, current }: { field: Extract<Field, { type: "image" }>; current: { id: number; alt: string } | null }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);
  const shown = preview ?? (current && !remove ? `/media/${current.id}` : null);
  return (
    <fieldset className="grid gap-3 border border-line p-4">
      <legend className="px-1 text-[13px] font-semibold text-ink">{field.label}</legend>
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid h-28 w-36 flex-none place-items-center overflow-hidden border border-line bg-mist">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-[12px] text-muted">No image</span>
          )}
        </div>
        <div className="grid min-w-0 flex-1 gap-2">
          <input
            type="file"
            name={field.name}
            accept="image/jpeg,image/png,image/webp"
            className="text-[14px] file:mr-3 file:cursor-pointer file:border-0 file:bg-ink file:px-3 file:py-2 file:text-white"
            onChange={(e) => {
              const f = e.currentTarget.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
          <span className="text-[12.5px] text-muted">JPG, PNG or WebP, up to 10 MB. Large photos are resized automatically. {field.help}</span>
          {current && (
            <label className="flex items-center gap-2 text-[13.5px]">
              <input type="checkbox" name={`${field.name}__remove`} checked={remove} onChange={(e) => setRemove(e.currentTarget.checked)} /> Remove current image
            </label>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${field.name}__alt`}>Image description for Google and screen readers</label>
        <input id={`${field.name}__alt`} name={`${field.name}__alt`} defaultValue={current?.alt ?? ""} maxLength={255} placeholder="For example: VMC machine in our Sanand workshop" />
      </div>
    </fieldset>
  );
}

export function ItemForm({ fields, values, images, categories, action, cancelHref, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errs = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid max-w-3xl gap-5">
      {state?.error && (
        <p role="alert" className="border-l-4 border-brand-red bg-red-50 px-4 py-3 text-[14px] text-brand-red-dark">
          {state.error}
        </p>
      )}
      {fields.map((f) => {
        const id = `f-${f.name}`;
        const err = errs[f.name];
        if (f.type === "image") return <ImageField key={f.name} field={f} current={images[f.name] ?? null} />;
        if (f.type === "checkbox")
          return (
            <label key={f.name} className="flex items-center gap-3 text-[15px]">
              <input type="checkbox" name={f.name} defaultChecked={Boolean(values[f.name] ?? true)} className="h-5 w-5" /> {f.label}
            </label>
          );
        return (
          <div key={f.name} className="field" data-invalid={err ? "true" : undefined}>
            <label htmlFor={id}>
              {f.label} {"required" in f && f.required && <span className="text-brand-red">*</span>}
            </label>
            {f.type === "category" ? (
              <select id={id} name={f.name} defaultValue={String(values[f.name] ?? "")} required>
                <option value="" disabled>
                  Choose a category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea id={id} name={f.name} defaultValue={String(values[f.name] ?? "")} maxLength={f.max} rows={f.rows ?? 4} required={f.required} />
            ) : (
              <input id={id} name={f.name} type={f.type === "url" ? "url" : "text"} defaultValue={String(values[f.name] ?? "")} maxLength={f.max} required={f.required} />
            )}
            {"help" in f && f.help && <span className="text-[12.5px] text-muted">{f.help}</span>}
            {err && <span className="err">{err}</span>}
          </div>
        );
      })}
      <div className="flex flex-wrap gap-3 border-t border-line pt-5">
        <button type="submit" className="btn btn-red" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href={cancelHref} className="btn btn-dark">
          Cancel
        </Link>
      </div>
    </form>
  );
}
