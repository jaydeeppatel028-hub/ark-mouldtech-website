import type { Metadata, Viewport } from "next";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource-variable/inter";
import "./globals.css";
import { IS_PREVIEW, SITE_URL } from "@/lib/config";

// Content is edited live in /admin, so pages render on request and read from a cache
// that admin changes clear. This also means the build never needs the database.
export const dynamic = "force-dynamic";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
