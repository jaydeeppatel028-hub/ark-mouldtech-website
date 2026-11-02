"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/config";
import { Icon } from "./Icon";

type Props = {
  addressShort: string;
  email: string;
  phone: { display: string; tel: string };
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader({ addressShort, email, phone }: Props) {
  const pathname = usePathname() ?? "/";

  return (
    <>
      {/* Utility bar */}
      <div className="bg-ink text-[13px] text-on-dark">
        <div className="wrap flex justify-between gap-4 py-2">
          <div className="flex min-w-0 flex-wrap gap-x-6 gap-y-1">
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <Icon name="pin" className="h-3.5 w-3.5 flex-none" />
              {addressShort}
            </span>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-on-dark no-underline hover:text-white">
              <Icon name="mail" className="h-3.5 w-3.5 flex-none" />
              {email}
            </a>
          </div>
          <a href={`tel:${phone.tel}`} className="inline-flex flex-none items-center gap-1.5 text-on-dark no-underline hover:text-white">
            <Icon name="phone" className="h-3.5 w-3.5 flex-none" />
            {phone.display}
          </a>
        </div>
      </div>

      <header className="sticky top-[env(safe-area-inset-top,0px)] z-50 border-b border-line bg-white">
        <div className="wrap flex h-16 max-w-[1280px] items-center gap-5 md:h-[78px]">
          <Link href="/" className="flex min-w-0 flex-[0_1_auto] items-center gap-2.5 no-underline md:gap-3" aria-label="ARK Mouldtech Solutions, home">
            <Image
              src="/brand/ark-logo.webp"
              alt="ARK logo"
              width={978}
              height={497}
              sizes="90px"
              priority
              className="h-[38px] w-auto flex-none md:h-11"
            />
            <span className="grid min-w-0 gap-[3px] border-l border-line pl-2.5 md:pl-3">
              <b className="font-head text-[14px] leading-tight font-extrabold tracking-[0.03em] text-ink max-[400px]:whitespace-normal md:text-[15px] md:whitespace-nowrap">
                ARK MOULDTECH SOLUTIONS
              </b>
              <small className="text-[9.5px] leading-tight tracking-[0.08em] text-muted uppercase max-[400px]:hidden md:text-[10.5px]">
                Precision Die &amp; Mould Manufacturing
              </small>
            </span>
          </Link>

          <nav aria-label="Main" className="ml-auto hidden gap-0.5 min-[1240px]:flex">
            {NAV.map((item) => {
              const on = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  className={`group relative px-2.5 py-2 font-head text-[14px] font-semibold whitespace-nowrap text-ink no-underline`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-2.5 bottom-0.5 h-0.5 bg-brand-red transition-transform ${on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />
                </Link>
              );
            })}
          </nav>
          <Link href="/contact#inquiry" className="btn btn-red hidden min-[1240px]:inline-flex">
            Get a Quote
          </Link>
        </div>

        {/* Phones and tablets: every page visible as a swipeable row, no hidden menu. */}
        <nav aria-label="Pages" className="border-t border-line bg-white min-[1240px]:hidden">
          <div className="wrap no-scrollbar flex gap-0.5 overflow-x-auto py-1 [mask-image:linear-gradient(90deg,#000_88%,transparent)]">
            {NAV.map((item) => {
              const on = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  className={`flex-none border-b-2 px-3 py-2.5 font-head text-[13.5px] font-semibold text-ink no-underline ${on ? "border-brand-red" : "border-transparent"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact#inquiry"
              className="ml-1.5 flex-none bg-brand-red px-3 py-2.5 font-head text-[13.5px] font-semibold text-white no-underline"
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
