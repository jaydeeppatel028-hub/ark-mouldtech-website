import type { Metadata, Viewport } from "next";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource-variable/inter";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { IS_PREVIEW, SITE_URL } from "@/lib/config";
import { getCompany } from "@/lib/content";
import { businessJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ARK Mouldtech Solutions", template: "%s | ARK Mouldtech Solutions" },
  robots: IS_PREVIEW ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#09050D",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const company = await getCompany();
  const primaryEmail = company.emails.find((e) => e.primary) ?? company.emails[0];
  const jsonLd = await businessJsonLd();

  return (
    <html lang="en-IN">
      <body>
        {IS_PREVIEW && (
          <div className="bg-brand-blue text-[13px] text-white">
            <p className="wrap py-2">
              <b>Preview.</b> Hatched panels mark where your own photos go. Dashed boxes are filled from the admin panel. Forms are not
              connected yet.
            </p>
          </div>
        )}
        <SiteHeader
          addressShort={`${company.address.line1}, Sanand GIDC, ${company.address.city}`}
          email={primaryEmail.address}
          phone={company.phone}
        />
        <main id="main">{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
