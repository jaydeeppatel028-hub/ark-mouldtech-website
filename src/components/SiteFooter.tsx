import Image from "next/image";
import Link from "next/link";
import { getCategories, getCompany } from "@/lib/content";
import { NAV } from "@/lib/config";
import { Icon } from "./Icon";

export async function SiteFooter() {
  const [company, categories] = await Promise.all([getCompany(), getCategories()]);
  const a = company.address;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night-2 text-[14px] text-dim">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-3 bg-white px-4 py-3">
            <Image src="/brand/ark-logo.webp" alt="ARK logo" width={978} height={497} sizes="90px" className="h-11 w-auto" />
            <span className="border-l border-line pl-3 font-head text-[13px] leading-tight font-extrabold tracking-[0.03em] text-ink">
              ARK MOULDTECH
              <br />
              SOLUTIONS
            </span>
          </div>
          <p>
            Precision die &amp; mould manufacturing, repair and machining job work from Sanand GIDC, Ahmedabad. Established{" "}
            {company.established}.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-[13px] tracking-[0.12em] text-white uppercase">Quick Links</h2>
          <ul className="grid gap-2.5">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-dim no-underline hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-[13px] tracking-[0.12em] text-white uppercase">Products &amp; Services</h2>
          <ul className="grid gap-2.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products#${c.slug}`} className="text-dim no-underline hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-[13px] tracking-[0.12em] text-white uppercase">Contact</h2>
          <ul className="grid gap-3">
            <li className="grid grid-cols-[18px_1fr] gap-2.5">
              <Icon name="pin" className="mt-1 h-4 w-4 text-sky" />
              <span>
                {a.line1}, {a.line2}, {a.city}, {a.state}, {a.country}
              </span>
            </li>
            <li className="grid grid-cols-[18px_1fr] gap-2.5">
              <Icon name="phone" className="mt-1 h-4 w-4 text-sky" />
              <a href={`tel:${company.phone.tel}`} className="text-dim no-underline hover:text-white">
                {company.phone.display}
              </a>
            </li>
            {company.emails.map((e) => (
              <li key={e.address} className="grid grid-cols-[18px_1fr] gap-2.5">
                <Icon name="mail" className="mt-1 h-4 w-4 text-sky" />
                <span className="min-w-0 break-words">
                  <span className="text-[12px] tracking-wide text-[#8a8f9c] uppercase">{e.label}: </span>
                  <a href={`mailto:${e.address}`} className="text-dim no-underline hover:text-white">
                    {e.address}
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap justify-between gap-4 py-4 text-[13px]">
          <span>
            © {year} {company.shortName} Solutions. All rights reserved.
          </span>
          <span>Sanand GIDC · Ahmedabad · Gujarat</span>
        </div>
      </div>
    </footer>
  );
}
