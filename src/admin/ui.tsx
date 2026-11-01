import Link from "next/link";

export function AdminTitle({ title, intro, action }: { title: string; intro?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <h1 className="text-[26px] font-extrabold">{title}</h1>
        {intro && <p className="max-w-[70ch] text-[14.5px] text-muted">{intro}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn btn-red">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Notice({ tone = "ok", children }: { tone?: "ok" | "error" | "info"; children: React.ReactNode }) {
  const cls = tone === "ok" ? "border-green-700 bg-green-50 text-green-900" : tone === "error" ? "border-brand-red bg-red-50 text-brand-red-dark" : "border-brand-blue bg-blue-50 text-ink";
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`mb-5 border-l-4 px-4 py-3 text-[14px] ${cls}`}>
      {children}
    </p>
  );
}
