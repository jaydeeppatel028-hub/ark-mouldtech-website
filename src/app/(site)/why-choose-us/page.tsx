import Link from "next/link";
import { ClientLogos } from "@/components/ClientLogos";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { Testimonials } from "@/components/Testimonials";
import { IS_PREVIEW } from "@/lib/config";
import { getClients, getCompany, getReasons, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("why", "/why-choose-us");

export default async function WhyChooseUsPage() {
  const [company, reasons, clients, testimonials] = await Promise.all([getCompany(), getReasons(), getClients(), getTestimonials()]);
  const showClients = clients.length > 0 || IS_PREVIEW;
  const showReviews = testimonials.length > 0 || IS_PREVIEW;

  return (
    <>
      <PageHeader
        eyebrow="Why Choose Us"
        title="A Tool Room You Can Rely On"
        intro="What you get when you bring your mould, tool or machining work to ARK Mouldtech Solutions."
        crumbs={[{ href: "/", label: "Home" }, { label: "Why Choose Us" }]}
      />

      <section className="band">
        <div className="wrap">
          <ol className="grid gap-px bg-line md:grid-cols-2">
            {reasons.map((r, i) => (
              <li key={r.title} className={`grid grid-cols-[52px_1fr] gap-5 bg-white p-7 ${i === reasons.length - 1 && reasons.length % 2 ? "md:col-span-2" : ""}`}>
                <div className="grid h-[52px] w-[52px] place-items-center bg-mist text-brand-blue">
                  <Icon name={r.icon} className="h-6 w-6" />
                </div>
                <div className="grid gap-1.5">
                  <h2 className="text-[18px] font-bold">{r.title}</h2>
                  <p className="max-w-[60ch] text-[15px] text-muted">{r.long}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

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

      <section className="border-t border-line py-12">
        <div className="wrap flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-[56ch] text-[17px] text-ink">See the machines behind the work, or browse everything we make and repair.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/infrastructure" className="btn btn-dark">
              Our Infrastructure
            </Link>
            <Link href="/products" className="btn btn-dark">
              Products &amp; Services
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner phone={company.phone} />
    </>
  );
}
