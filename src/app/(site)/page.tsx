import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { ClientLogos } from "@/components/ClientLogos";
import { CtaBanner } from "@/components/CtaBanner";
import { HeroDrawing } from "@/components/HeroDrawing";
import { Icon } from "@/components/Icon";
import { Testimonials } from "@/components/Testimonials";
import { IS_PREVIEW } from "@/lib/config";
import { getClients, getCompany, getFeaturedCategories, getMachines, getReasons, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("home", "/");

export default async function HomePage() {
  const [company, categories, machines, reasons, clients, testimonials] = await Promise.all([
    getCompany(),
    getFeaturedCategories(),
    getMachines(),
    getReasons(),
    getClients(),
    getTestimonials(),
  ]);
  const qty = (name: string) => machines.find((m) => m.name.toLowerCase().startsWith(name))?.quantity ?? "";
  const infraFacts: [string, string][] = [
    [company.workshopArea, "Workshop area"],
    [qty("vmc"), "VMC machines"],
    [qty("edm"), "EDM machines"],
    [String(machines.length - 2), "More machines & equipment"],
  ];
  const KEY_REASONS = ["Precision Engineering", "Quality-Focused Manufacturing", "Repair & Maintenance Support", "Strategic Industrial Location"];
  const keyReasons = reasons.filter((r) => KEY_REASONS.includes(r.title));
  const showClients = clients.length > 0 || IS_PREVIEW;
  const showReviews = testimonials.length > 0 || IS_PREVIEW;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="photo-slot absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(9_5_13/0.94)_0%,rgb(9_5_13/0.78)_48%,rgb(9_5_13/0.35)_100%)]" aria-hidden="true" />
        <HeroDrawing className="absolute top-1/2 right-[max(16px,4vw)] z-[1] w-[min(46vw,560px)] -translate-y-1/2 opacity-55 max-lg:right-[-10vw] max-lg:w-[80vw] max-lg:opacity-20" />
        {IS_PREVIEW && (
          <span className="photo-tag !top-4 !right-[max(16px,env(safe-area-inset-right))] !bottom-auto !left-auto z-[3] max-sm:hidden">
            <Icon name="camera" className="h-3.5 w-3.5 flex-none" />
            Hero photo: VMC machining in your workshop
          </span>
        )}
        <div className="wrap relative z-[2] pt-12 md:pt-16">
          <h1 className="max-w-[21ch] text-[clamp(30px,4.2vw,52px)] font-extrabold tracking-[-0.02em] text-white">
            Precision Engineering. Reliable Manufacturing. <em className="text-brand-red not-italic">Quality Solutions.</em>
          </h1>
          <p className="mt-5 max-w-[54ch] text-[clamp(16px,1.5vw,18px)] text-on-dark">
            Your trusted partner for precision die &amp; mould manufacturing, tooling solutions, repair &amp; maintenance and industrial engineering
            services.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/products" className="btn btn-red">
              Explore Our Capabilities
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Contact Us
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-2 border-t border-white/15 md:grid-cols-[repeat(4,auto)]">
            {[
              [String(company.established), "Established"],
              [company.workshopArea, "Workshop, Sanand GIDC"],
              ["State‑of‑the‑Art", "Infrastructure"],
              ["Injection Die & Mould", "Design & manufacturing"],
            ].map(([value, label], i) => (
              <div
                key={label}
                className={`grid gap-0.5 py-4 pr-5 pb-5 ${i === 1 ? "border-l border-white/15 pl-5" : ""} ${i >= 2 ? "col-span-2 border-t border-white/15 md:col-span-1 md:border-t-0 md:border-l md:pl-5" : ""}`}
              >
                <dt className="order-2 text-[13px] text-on-dark">{label}</dt>
                <dd className="order-1 font-head text-[clamp(19px,1.9vw,24px)] font-extrabold text-white tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-14">
        <div className="wrap grid items-start gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div className="grid min-w-0 gap-4">
            <span className="eyebrow">About ARK Mouldtech</span>
            <h2 className="h2">Engineering Excellence Since {company.established}</h2>
            <p className="max-w-[62ch] text-muted">{company.intro}</p>
            <Link href="/about" className="btn btn-dark mt-1 justify-self-start">
              More About Us
            </Link>
          </div>
          <dl className="grid grid-cols-[auto_1fr] border-b border-line text-[14px] lg:mt-9">
            {[
              ["Established", String(company.established)],
              ["Founder", company.founder],
              ["Location", `Sanand GIDC, ${company.address.city}, ${company.address.state}`],
              ["Sectors", company.sectors.slice(0, 3).join(" · ")],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="border-t border-line py-3 pr-5 text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">{k}</dt>
                <dd className="border-t border-line py-2.5 font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Products and services */}
      <section className="bg-mist py-14" id="products">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Products &amp; Services</span>
              <h2 className="h2">What We Make and Maintain</h2>
              <p className="lead">Mould and tool manufacturing, repair and machining job work under one roof.</p>
            </div>
            <Link href="/products" className="btn btn-dark">
              View All Products
            </Link>
          </div>
          <div className="no-scrollbar -mr-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2.5 md:mr-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:pb-0 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
          <p className="mt-2 text-[13px] text-muted md:hidden">Swipe to see all categories →</p>
        </div>
      </section>

      {/* Infrastructure: short preview, full list on /infrastructure */}
      <section className="on-dark bg-night py-12 text-on-dark md:py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12">
          <div className="grid gap-3">
            <span className="eyebrow">Infrastructure</span>
            <h2 className="text-[clamp(24px,2.6vw,32px)] font-extrabold">State-of-the-Art Infrastructure</h2>
            <p className="text-dim">Machining, grinding and inspection under one roof in Sanand GIDC.</p>
          </div>
          <div className="grid gap-6">
            <dl className="grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
              {infraFacts.map(([value, label]) => (
                <div key={label} className="grid gap-0.5 bg-night p-4 md:p-5">
                  <dt className="order-2 text-[13px] text-dim">{label}</dt>
                  <dd className="order-1 font-head text-[20px] font-extrabold whitespace-nowrap text-white tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/infrastructure" className="btn btn-ghost justify-self-start">
              See All Machines
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us: four key points, full list on /why-choose-us */}
      <section className="py-14">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Why Choose Us</span>
              <h2 className="h2">A Tool Room You Can Rely On</h2>
            </div>
            <Link href="/why-choose-us" className="btn btn-dark">
              Why Choose Us
            </Link>
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {keyReasons.map((r) => (
              <li key={r.title} className="grid content-start gap-3 bg-white p-6">
                <span className="grid h-11 w-11 place-items-center bg-mist text-brand-blue">
                  <Icon name={r.icon} className="h-[22px] w-[22px]" />
                </span>
                <h3 className="text-[16px] font-bold">{r.title}</h3>
                <p className="text-[14px] text-muted">{r.short}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Clients and testimonials share one section */}
      {(showClients || showReviews) && (
        <section className="bg-mist py-14" aria-labelledby="clients-h">
          {showClients && (
            <>
              <div className="wrap shead !mb-6">
                <div>
                  <span className="eyebrow">Our Esteemed Clients</span>
                  <h2 className="h2" id="clients-h">
                    Companies We Work With
                  </h2>
                </div>
              </div>
              <ClientLogos clients={clients} />
            </>
          )}
          {showReviews && (
            <div className={`wrap ${showClients ? "mt-12" : ""}`}>
              <h3 className="mb-[-28px] font-head text-[13px] font-bold tracking-[0.12em] text-muted uppercase max-sm:mb-0">What our customers say</h3>
              <Testimonials testimonials={testimonials} preview={IS_PREVIEW} compact />
            </div>
          )}
        </section>
      )}

      <CtaBanner phone={company.phone} />
    </>
  );
}
