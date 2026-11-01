"use client";

import { useActionState } from "react";
import type { SettingsState } from "./settings-actions";

/** Wraps a server-rendered set of fields with error display and a save button. */
export function SettingsForm({ action, children }: { action: (p: SettingsState, d: FormData) => Promise<SettingsState>; children: React.ReactNode }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="grid max-w-3xl gap-5">
      {state?.error && (
        <p role="alert" className="border-l-4 border-brand-red bg-red-50 px-4 py-3 text-[14px] text-brand-red-dark">
          {state.error}
        </p>
      )}
      {children}
      <div className="border-t border-line pt-5">
        <button type="submit" className="btn btn-red" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
