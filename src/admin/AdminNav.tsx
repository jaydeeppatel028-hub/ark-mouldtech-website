"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/machines", label: "Machines" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/clients", label: "Client logos" },
  { href: "/admin/testimonials", label: "Reviews" },
  { href: "/admin/company", label: "Company info" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/account", label: "Password" },
];

export function AdminNav() {
  const path = usePathname() ?? "/admin";
  const on = (href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(href + "/"));
  return (
    <nav aria-label="Admin" className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={on(l.href) ? "page" : undefined}
          className={`flex-none px-3 py-2 text-[14px] font-medium no-underline lg:px-4 ${on(l.href) ? "bg-white text-ink lg:border-l-[3px] lg:border-brand-red" : "text-on-dark hover:bg-white/10 hover:text-white"}`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
