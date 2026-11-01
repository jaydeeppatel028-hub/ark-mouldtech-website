import type { Metadata } from "next";
import { getCompany, getSeo } from "./content";
import { SITE_URL } from "./config";

type PageKey = Parameters<typeof getSeo>[0];

export async function pageMetadata(page: PageKey, path: string): Promise<Metadata> {
  const s = await getSeo(page);
  return {
    title: { absolute: s.title },
    description: s.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${path}`,
      title: s.title,
      description: s.description,
      siteName: "ARK Mouldtech Solutions",
      locale: "en_IN",
      images: [{ url: "/brand/ark-logo.png", width: 978, height: 497, alt: "ARK Mouldtech Solutions logo" }],
    },
  };
}

/** Organization + LocalBusiness structured data for search engines. */
export async function businessJsonLd() {
  const c = await getCompany();
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: "ARK Mouldtech Solutions",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/ark-logo.png`,
    image: `${SITE_URL}/brand/ark-logo.png`,
    foundingDate: String(c.established),
    founder: { "@type": "Person", name: c.founder.replace(/^Mr\.?\s*/, "") },
    telephone: c.phone.tel,
    email: c.emails.find((e) => e.primary)?.address,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${c.address.line1}, ${c.address.line2}`,
      addressLocality: c.address.city,
      addressRegion: c.address.state,
      addressCountry: "IN",
      ...(c.address.pincode ? { postalCode: c.address.pincode } : {}),
    },
    areaServed: ["Sanand", "Ahmedabad", "Gujarat", "India"],
  };
}
