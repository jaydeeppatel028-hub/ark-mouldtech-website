import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdminNav } from "@/admin/AdminNav";
import { requireAdmin, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: { absolute: "Admin | ARK Mouldtech Solutions" }, robots: { index: false, follow: false } };

async function signOut() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-ink text-on-dark lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block">
          <Link href="/admin" className="flex items-center gap-2 no-underline">
            <span className="bg-white px-2 py-1">
              <Image src="/brand/ark-logo.webp" alt="ARK logo" width={978} height={497} sizes="56px" className="h-7 w-auto" />
            </span>
            <span className="font-head text-[13px] font-bold text-white">Admin</span>
          </Link>
          <div className="text-right text-[12px] lg:mt-4 lg:text-left">
            <div className="truncate text-white">{user.name}</div>
            <form action={signOut}>
              <button type="submit" className="text-sky underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="px-2 pb-3 lg:pb-6">
          <AdminNav />
        </div>
        <div className="hidden px-4 pb-6 lg:block">
          <Link href="/" target="_blank" className="text-[13px] text-sky">
            View website ↗
          </Link>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
