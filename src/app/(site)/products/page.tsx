import Link from "next/link";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { PhotoSlot } from "@/components/PhotoSlot";
import type { Product } from "@/content/site";
import { getCategories, getCompany, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("products", "/products");

const DETAIL_FIELDS: [keyof Product, string][] = [
  ["material", "Material"],
  ["dimensions", "Dimensions"],
  ["specifications", "Technical specifications"],
  ["applications", "Applications"],
];

function ProductItem({ product }: { product: Product }) {
  const details = DETAIL_FIELDS.filter(([k]) => product[k]);
  return (
    <article id={product.slug} className="grid scroll-mt-36 grid-cols-[96px_minmax(0,1fr)] gap-4 border border-line bg-white p-3 sm:grid-cols-[120px_minmax(0,1fr)]">
      <PhotoSlot photo={product.photo} label="Photo" light className="aspect-square self-start" sizes="120px" />
      <div className="flex min-w-0 flex-col gap-1.5 py-1 pr-1">
        <h3 className="text-[16px] font-bold">{product.name}</h3>
        {product.description && <p className="text-[14px] text-muted">{product.description}</p>}
        {details.length > 0 && (
          <details className="group mt-1 border-t border-line pt-2.5">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-head text-[13px] font-bold text-brand-blue">
              <Icon name="plus" className="h-4 w-4 transition group-open:rotate-45" />
              Technical details
            </summary>
            <dl className="mt-3 grid gap-2 text-[14px]">
              {details.map(([k, label]) => (
                <div key={k}>
                  <dt className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{label}</dt>
                  <dd className="whitespace-pre-line text-ink">{String(product[k])}</dd>
                </div>
              ))}
            </dl>
          </details>
        )}
        <Link
          href={`/contact?product=${encodeURIComponent(product.name)}#inquiry`}
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-1 font-head text-[13px] font-bold text-brand-red no-underline hover:underline"
        >
          Send inquiry <Icon name="arrow" className="h-3.5 w-3.5" strokeWidth={2.2} />
        </Link>
      </div>
    </article>
  );
}

export default async function ProductsPage() {
  const [company, categories, products] = await Promise.all([getCompany(), getCategories(), getProducts()]);

  return (
    <>
      <PageHeader
        eyebrow="Products & Services"
        title="Moulds, Tools, Repair and Machining"
        intro="Seven areas of work, from new injection moulds to repair, trolleys and machining job work. Ask about any item and we'll reply with details."
        crumbs={[{ href: "/", label: "Home" }, { label: "Products & Services" }]}
      />

      {/* Category jump links */}
      <nav aria-label="Product categories" className="border-b border-line bg-white">
        <div className="wrap no-scrollbar flex gap-2 overflow-x-auto py-3">
          {categories.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="flex-none border border-line px-3.5 py-2 text-[13.5px] font-medium text-ink no-underline hover:border-ink">
              {c.name}
            </a>
          ))}
        </div>
      </nav>

      {categories.map((c, i) => {
        const items = products.filter((p) => p.category === c.slug);
        return (
          <section key={c.slug} id={c.slug} className={`scroll-mt-28 py-12 md:py-14 ${i % 2 ? "bg-mist" : ""}`} aria-labelledby={`${c.slug}-h`}>
            <div className="wrap grid items-start gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-12">
              <div className="grid gap-3 lg:sticky lg:top-28">
                <span className="eyebrow">{c.group}</span>
                <h2 id={`${c.slug}-h`} className="text-[clamp(24px,2.6vw,32px)] font-extrabold">
                  {c.name}
                </h2>
                <p className="text-muted">{c.summary}</p>
                <Link href={`/contact?product=${encodeURIComponent(c.name)}#inquiry`} className="btn btn-red justify-self-start">
                  Ask for a Quote
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((p) => (
                  <ProductItem key={p.slug} product={p} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <CtaBanner phone={company.phone} />
    </>
  );
}
