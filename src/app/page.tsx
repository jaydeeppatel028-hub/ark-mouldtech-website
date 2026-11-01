import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { ClientLogos } from "@/components/ClientLogos";
import { CtaBanner } from "@/components/CtaBanner";
import { HeroDrawing } from "@/components/HeroDrawing";
import { Icon } from "@/components/Icon";
import { PhotoSlot } from "@/components/PhotoSlot";
import { ReasonsGrid } from "@/components/ReasonsGrid";
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
  const location = reasons.find((r) => r.icon === "pin");
  const otherReasons = reasons.filter((r) => r !== location);
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
        <div className="wrap relative z-[2] pt-16 md:pt-[88px]">
          <h1 className="max-w-[15ch] text-[clamp(32px,4.6vw,56px)] font-extrabold tracking-[-0.02em] text-white">
            Precision Engineering. Reliable Manufacturing. <em className="text-brand-red not-italic">Quality Solutions.</em>
          </h1>
          <p className="mt-5 max-w-[54ch] text-[clamp(16px,1.5vw,18px)] text-on-dark">
            Your trusted partner for precision die &amp; mould manufacturing, tooling solutions, repair &amp; maintenance and industrial engineering
            services.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn btn-red">
              Explore Our Capabilities
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Contact Us
            </Link>
          </div>
          <dl className="mt-16 grid grid-cols-2 border-t border-white/15 md:grid-cols-[repeat(4,auto)]">
            {[
              [String(company.established), "Established"],
              [company.workshopArea, "Workshop, Sanand GIDC"],
              ["State‑of‑the‑Art", "Infrastructure"],
              ["Injection Die & Mould", "Design & manufacturing"],
            ].map(([value, label], i) => (
              <div
                key={label}
                className={`grid gap-0.5 py-5 pr-5 pb-6 ${i === 1 ? "border-l border-white/15 pl-5" : ""} ${i >= 2 ? "col-span-2 border-t border-white/15 md:col-span-1 md:border-t-0 md:border-l md:pl-5" : ""}`}
              >
                <dt className="order-2 text-[13px] text-on-dark">{label}</dt>
                <dd className="order-1 font-head text-[clamp(19px,1.9vw,24px)] font-extrabold text-white tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Introduction */}
      <section className="band">
        <div className="wrap grid items-center gap-9 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div className="grid min-w-0 gap-[18px]">
            <span className="eyebrow">About ARK Mouldtech</span>
            <h2 className="h2">Engineering Excellence Since {company.established}</h2>
            <p className="max-w-[60ch] text-muted">{company.intro}</p>
            <p className="max-w-[60ch] text-muted">
              We work with manufacturers in the automotive, electronics and consumer goods sectors, combining in-house VMC and EDM machining with
              hands-on tool room experience and on-time delivery.
            </p>
            <Link href="/about" className="btn btn-dark mt-1.5 justify-self-start">
              Learn More
            </Link>
          </div>
          <div className="border border-line bg-white">
            <PhotoSlot label="Photo: workshop exterior or team" className="aspect-video" sizes="(max-width: 1024px) 100vw, 520px" />
            <dl className="grid grid-cols-[auto_1fr] text-[14px]">
              {[
                ["Established", String(company.established)],
                ["Founder", company.founder],
                ["Location", `Sanand GIDC, ${company.address.city}, ${company.address.state}`],
                ["Sectors", company.sectors.slice(0, 3).join(" · ")],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="border-t border-line px-[18px] pt-3.5 pb-3 text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">{k}</dt>
                  <dd className="border-t border-line px-[18px] py-3 font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Products and services */}
      <section className="band bg-mist" id="products">
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

      {/* Infrastructure */}
      <section className="band on-dark bg-night text-on-dark">
        <div className="wrap grid items-start gap-9 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div className="grid min-w-0 gap-[18px]">
            <span className="eyebrow">Infrastructure</span>
            <h2 className="h2">Our Manufacturing Infrastructure</h2>
            <p className="lead">Our facility is equipped with machining, tooling and inspection equipment to support a wide range of precision manufacturing work.</p>
            <table className="mt-2 w-full border-collapse text-[14.5px]">
              <thead>
                <tr>
                  <th className="border-b border-white/20 pb-2.5 text-left font-head text-[11px] font-semibold tracking-[0.12em] text-[#8a8f9c] uppercase">Machine / Equipment</th>
                  <th className="border-b border-white/20 pb-2.5 text-right font-head text-[11px] font-semibold tracking-[0.12em] text-[#8a8f9c] uppercase">Qty</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((m) => (
                  <tr key={m.name}>
                    <td className="border-b border-white/[0.08] py-[11px] text-white">{m.name}</td>
                    <td className="border-b border-white/[0.08] py-[11px] text-right font-head font-bold text-white tabular-nums">{m.quantity}</td>
                  </tr>
                ))}
                <tr>
                  <td className="border-b border-white/[0.08] py-[11px] text-sky">Workshop Area</td>
                  <td className="border-b border-white/[0.08] py-[11px] text-right font-head font-bold text-sky tabular-nums">{company.workshopArea}</td>
                </tr>
              </tbody>
            </table>
            <Link href="/infrastructure" className="btn btn-ghost mt-2.5 justify-self-start">
              Explore Our Infrastructure
            </Link>
          </div>
          <div className="grid grid-cols-2 grid-rows-[200px_130px] gap-3 lg:min-h-[420px] lg:grid-cols-[1.4fr_1fr] lg:grid-rows-2">
            <PhotoSlot label="VMC machine" className="col-span-2 lg:col-span-1 lg:row-span-2" sizes="(max-width: 1024px) 100vw, 360px" />
            <PhotoSlot label="EDM machine" sizes="(max-width: 1024px) 50vw, 260px" />
            <PhotoSlot label="Inspection" sizes="(max-width: 1024px) 50vw, 260px" />
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="band">
        <div className="wrap grid items-start gap-9 lg:grid-cols-[1fr_2fr] lg:gap-14">
          <div className="grid min-w-0 gap-[18px]">
            <span className="eyebrow">Why Choose Us</span>
            <h2 className="h2">A Tool Room You Can Rely On</h2>
            <p className="lead">Practical engineering, honest timelines and support that continues after delivery.</p>
            {location && (
              <div className="mt-2 grid gap-2 bg-ink p-[22px] text-on-dark">
                <h3 className="flex items-center gap-2.5 text-[16px] text-white">
                  <Icon name="pin" className="h-5 w-5 flex-none text-brand-red" />
                  {location.title}
                </h3>
                <p className="text-[14px]">{location.long}</p>
              </div>
            )}
            <Link href="/why-choose-us" className="btn btn-dark justify-self-start">
              Why Choose Us
            </Link>
          </div>
          <ReasonsGrid reasons={otherReasons} />
        </div>
      </section>

      {/* Clients */}
      {showClients && (
        <section className="bg-mist py-16" aria-labelledby="clients-h">
          <div className="wrap shead !mb-7">
            <div>
              <span className="eyebrow">Our Esteemed Clients</span>
              <h2 className="h2" id="clients-h">
                Companies We Work With
              </h2>
            </div>
          </div>
          <ClientLogos clients={clients} />
        </section>
      )}

      {/* Testimonials */}
      {showReviews && (
        <section className="band" aria-labelledby="t-h">
          <div className="wrap">
            <div className="shead !mb-0">
              <div>
                <span className="eyebrow">Client Testimonials</span>
                <h2 className="h2" id="t-h">
                  What Our Customers Say
                </h2>
              </div>
            </div>
            <Testimonials testimonials={testimonials} preview={IS_PREVIEW} />
          </div>
        </section>
      )}

      <CtaBanner phone={company.phone} />
    </>
  );
}
