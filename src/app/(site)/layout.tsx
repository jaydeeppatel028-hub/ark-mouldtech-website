import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { IS_PREVIEW } from "@/lib/config";
import { getCompany } from "@/lib/content";
import { businessJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [company, jsonLd] = await Promise.all([getCompany(), businessJsonLd()]);
  const primaryEmail = company.emails.find((e) => e.primary) ?? company.emails[0];

  return (
    <>
      {IS_PREVIEW && (
        <div className="bg-brand-blue text-[13px] text-white">
          <p className="wrap py-2">
            <b>Preview.</b> Hatched panels mark where your own photos go. Dashed boxes are filled from the admin panel.
          </p>
        </div>
      )}
      <SiteHeader
        addressShort={`${company.address.line1}, Sanand GIDC, ${company.address.city}`}
        email={primaryEmail?.address ?? ""}
        phone={company.phone}
      />
      <main id="main">{children}</main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
