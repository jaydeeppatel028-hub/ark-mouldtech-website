"use client";

import { useActionState } from "react";
import type { AuthState } from "./auth-actions";

type Input = { name: string; label: string; type?: string; autoComplete?: string; help?: string };

export function AuthForm({ action, inputs, submitLabel }: { action: (p: AuthState, d: FormData) => Promise<AuthState>; inputs: Input[]; submitLabel: string }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="grid gap-4">
      {state?.error && (
        <p role="alert" className="border-l-4 border-brand-red bg-red-50 px-4 py-3 text-[14px] text-brand-red-dark">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="border-l-4 border-green-700 bg-green-50 px-4 py-3 text-[14px] text-green-900">
          {state.ok}
        </p>
      )}
      {inputs.map((i) => (
        <div key={i.name} className="field">
          <label htmlFor={`a-${i.name}`}>{i.label}</label>
          <input id={`a-${i.name}`} name={i.name} type={i.type ?? "text"} autoComplete={i.autoComplete} required />
          {i.help && <span className="text-[12.5px] text-muted">{i.help}</span>}
        </div>
      ))}
      <button type="submit" className="btn btn-red justify-self-start" disabled={pending}>
        {pending ? "Please wait…" : submitLabel}
      </button>
    </form>
  );
}
