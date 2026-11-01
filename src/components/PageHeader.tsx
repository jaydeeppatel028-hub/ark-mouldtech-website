import Link from "next/link";

type Crumb = { href?: string; label: string };

/** Dark title band at the top of inner pages, with breadcrumb navigation. */
export function PageHeader({ eyebrow, title, intro, crumbs }: { eyebrow: string; title: string; intro?: string; crumbs: Crumb[] }) {
  return (
    <section className="on-dark relative overflow-hidden bg-ink">
      <div className="photo-slot absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="wrap relative grid gap-4 py-14 md:py-16">
        <nav aria-label="Breadcrumb" className="text-[13px] text-dim">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {c.href ? (
                  <Link href={c.href} className="text-dim no-underline hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="max-w-[22ch] text-[clamp(30px,4vw,46px)] font-extrabold tracking-[-0.015em] text-white">{title}</h1>
        {intro && <p className="max-w-[62ch] text-[17px] text-on-dark">{intro}</p>}
      </div>
    </section>
  );
}
