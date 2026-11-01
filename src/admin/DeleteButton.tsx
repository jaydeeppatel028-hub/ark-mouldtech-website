"use client";

import { useState } from "react";

/** Two-step delete so nothing is removed by a single mis-tap. */
export function DeleteButton({ action, label = "Delete" }: { action: () => Promise<void>; label?: string }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="btn border-brand-red text-brand-red hover:bg-brand-red hover:text-white">
        {label}
      </button>
    );
  }
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <span className="text-[14px] text-ink">Delete permanently?</span>
      <button type="submit" className="btn btn-red">
        Yes, delete
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="btn btn-dark">
        Cancel
      </button>
    </form>
  );
}
