import Link from "next/link";

export function CtaBanner({ phone }: { phone: { display: string; tel: string } }) {
  return (
    <section className="relative overflow-hidden bg-ink before:absolute before:inset-0 before:bg-[repeating-linear-gradient(45deg,rgb(255_255_255/0.04)_0_1px,transparent_1px_11px)]">
      <div className="wrap relative flex flex-wrap items-center justify-between gap-8 py-14">
        <div>
          <h2 className="max-w-[24ch] text-[clamp(22px,2.8vw,32px)] font-extrabold text-white">
            Looking for Reliable Die &amp; Mould Manufacturing Solutions?
          </h2>
          <p className="mt-2.5 text-on-dark">Connect with ARK Mouldtech Solutions for your next manufacturing project.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3.5">
          <Link href="/contact#inquiry" className="btn btn-red">
            Contact Our Team
          </Link>
          <a href={`tel:${phone.tel}`} className="font-head font-bold text-white tabular-nums no-underline">
            {phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
