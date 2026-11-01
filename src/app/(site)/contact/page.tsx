import { ClientLogos } from "@/components/ClientLogos";
import { Icon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHeader } from "@/components/PageHeader";
import { IS_PREVIEW } from "@/lib/config";
import { getClients, getCompany } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("contact", "/contact");

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [company, clients, params] = await Promise.all([getCompany(), getClients(), searchParams]);
  const rawProduct = Array.isArray(params.product) ? params.product[0] : params.product;
  const product = rawProduct ? rawProduct.slice(0, 150) : undefined;
  const a = company.address;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapQuery)}`;
  const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(company.mapQuery)}&z=15&output=embed`;

  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Talk to Our Team"
        intro="Send us your drawing, sample details or requirement. We usually reply by phone or email."
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact Us" }]}
      />

      <section className="band">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14">
          {/* Contact details */}
          <div className="grid gap-4">
            <h2 className="text-[22px] font-extrabold">{company.name}</h2>
            <div className="grid gap-px border border-line bg-line">
              <div className="grid grid-cols-[40px_1fr] gap-4 bg-white p-5">
                <span className="grid h-10 w-10 place-items-center bg-mist text-brand-blue">
                  <Icon name="pin" className="h-5 w-5" />
                </span>
                <div className="grid gap-1">
                  <span className="text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">Address</span>
                  <address className="text-ink not-italic">
                    {a.line1},<br />
                    {a.line2},<br />
                    {a.city}, {a.state}, {a.country}.
                  </address>
                  <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-[14px] font-semibold">
                    Open in Google Maps
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-[40px_1fr] gap-4 bg-white p-5">
                <span className="grid h-10 w-10 place-items-center bg-mist text-brand-blue">
                  <Icon name="phone" className="h-5 w-5" />
                </span>
                <div className="grid gap-1">
                  <span className="text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">Phone</span>
                  <a href={`tel:${company.phone.tel}`} className="font-head text-[18px] font-bold text-ink tabular-nums no-underline">
                    {company.phone.display}
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-[40px_1fr] gap-4 bg-white p-5">
                <span className="grid h-10 w-10 place-items-center bg-mist text-brand-blue">
                  <Icon name="mail" className="h-5 w-5" />
                </span>
                <div className="grid min-w-0 gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">Email</span>
                  {company.emails.map((e) => (
                    <div key={e.address} className="min-w-0">
                      <span className="block text-[12px] text-muted">{e.label}</span>
                      <a href={`mailto:${e.address}`} className="break-words text-ink">
                        {e.address}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-line bg-mist">
              <iframe
                title="Map showing ARK Mouldtech Solutions in Sanand GIDC"
                src={mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>

          {/* Inquiry form */}
          <div id="inquiry" className="scroll-mt-36 bg-mist p-6 md:p-9">
            <span className="eyebrow">Send an Inquiry</span>
            <h2 className="mt-3 mb-2 text-[clamp(22px,2.4vw,28px)] font-extrabold">Tell Us What You Need</h2>
            <p className="mb-6 text-[15px] text-muted">
              {product ? (
                <>
                  You&apos;re asking about <b className="text-ink">{product}</b>.
                </>
              ) : (
                "Share your part, quantity and timeline, and we'll get back to you."
              )}
            </p>
            <InquiryForm product={product} />
          </div>
        </div>
      </section>

      {(clients.length > 0 || IS_PREVIEW) && (
        <section className="border-t border-line bg-white py-12" aria-labelledby="c-clients">
          <div className="wrap grid gap-5">
            <h2 id="c-clients" className="text-[13px] font-bold tracking-[0.12em] text-muted uppercase">
              Companies we work with
            </h2>
            <ClientLogos clients={clients} compact />
          </div>
        </section>
      )}
    </>
  );
}
