import Link from "next/link";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { PhotoSlot } from "@/components/PhotoSlot";
import { ReasonsGrid } from "@/components/ReasonsGrid";
import { getCategories, getCompany, getCoreValues, getMachines, getReasons } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("about", "/about");

export default async function AboutPage() {
  const [company, values, categories, machines, reasons] = await Promise.all([
    getCompany(),
    getCoreValues(),
    getCategories(),
    getMachines(),
    getReasons(),
  ]);
  const a = company.address;

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Precision Tooling from Sanand GIDC"
        intro={`Established in ${company.established}, ARK Mouldtech Solutions manufactures, repairs and maintains moulds, dies, press tools and material handling equipment.`}
        crumbs={[{ href: "/", label: "Home" }, { label: "About Us" }]}
      />

      {/* Introduction and key facts */}
      <section className="band">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div className="grid min-w-0 gap-[18px]">
            <span className="eyebrow">Company Background</span>
            <h2 className="h2">Who We Are</h2>
            {company.about.map((p, i) => (
              <p key={i} className="max-w-[62ch] text-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="grid gap-4">
            <PhotoSlot label="Photo: founder or team at the workshop" className="aspect-[4/3]" sizes="(max-width: 1024px) 100vw, 480px" />
            <dl className="grid grid-cols-2 border-t border-l border-line text-[14px]">
              {[
                ["Established", String(company.established)],
                ["Founder", company.founder],
                ["Workshop", company.workshopArea],
                ["Location", `Sanand GIDC, ${a.city}`],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 border-r border-b border-line p-4">
                  <dt className="text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">{k}</dt>
                  <dd className="font-head text-[16px] font-bold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Vision and mission */}
      <section className="on-dark bg-night py-16">
        <div className="wrap">
        <div className="grid gap-px bg-white/10 md:grid-cols-2">
          {[
            ["Our Vision", company.vision, "target"],
            ["Our Mission", company.mission, "draft"],
          ].map(([title, text, icon]) => (
            <div key={title} className="grid content-start gap-4 bg-night p-8 md:p-10">
              <Icon name={icon as "target"} className="h-8 w-8 text-brand-red" />
              <h2 className="text-[24px] font-extrabold">{title}</h2>
              <p className="max-w-[52ch] text-[17px] text-on-dark">{text}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Core values */}
      <section className="band">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Core Values</span>
              <h2 className="h2">What Guides Our Work</h2>
            </div>
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <li key={v.title} className="grid gap-2 bg-white p-6">
                <h3 className="flex items-center gap-2.5 text-[17px] font-bold">
                  <span className="h-2.5 w-2.5 flex-none bg-brand-red" aria-hidden="true" />
                  {v.title}
                </h3>
                <p className="text-[14.5px] text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Capabilities */}
      <section className="band bg-mist">
        <div className="wrap grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="grid min-w-0 gap-[18px]">
            <span className="eyebrow">Manufacturing Capabilities</span>
            <h2 className="h2">What We Do</h2>
            <ul className="grid gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products#${c.slug}`} className="flex items-start gap-3 border-b border-line py-2.5 text-ink no-underline hover:text-brand-blue">
                    <Icon name="check" className="mt-1 h-4 w-4 flex-none text-brand-blue" strokeWidth={2.6} />
                    <span>
                      <b className="font-semibold">{c.name}</b>
                      <span className="block text-[14px] text-muted">{c.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid min-w-0 gap-[18px]">
            <span className="eyebrow">In-house Equipment</span>
            <h2 className="h2">{company.workshopArea} Workshop</h2>
            <ul className="grid grid-cols-2 gap-px bg-line">
              {machines.map((m) => (
                <li key={m.name} className="flex items-baseline justify-between gap-3 bg-white px-4 py-3 text-[14px]">
                  <span className="text-ink">{m.name}</span>
                  <b className="font-head text-brand-blue tabular-nums">{m.quantity}</b>
                </li>
              ))}
            </ul>
            <Link href="/infrastructure" className="btn btn-dark justify-self-start">
              See Our Infrastructure
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="band">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Why Choose ARK Mouldtech Solutions</span>
              <h2 className="h2">Reasons Customers Work With Us</h2>
            </div>
            <Link href="/why-choose-us" className="btn btn-dark">
              Read More
            </Link>
          </div>
          <ReasonsGrid reasons={reasons.slice(0, 6)} />
        </div>
      </section>

      <CtaBanner phone={company.phone} />
    </>
  );
}
