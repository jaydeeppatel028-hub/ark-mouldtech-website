/** Public site URL, used for canonical links, sitemap and structured data. */
export const SITE_URL = (process.env.SITE_URL ?? "https://www.arkmouldtech.com").replace(/\/$/, "");

/**
 * Preview mode shows labelled placeholders where photos, client logos and
 * reviews will go. Set SITE_PREVIEW=off before launch so empty sections are
 * hidden instead.
 */
export const IS_PREVIEW = process.env.SITE_PREVIEW !== "off";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products & Services" },
  { href: "/infrastructure", label: "Infrastructure" },
  { href: "/why-choose-us", label: "Why Choose Us" },
  { href: "/contact", label: "Contact Us" },
] as const;
