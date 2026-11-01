import type { MetadataRoute } from "next";
import { IS_PREVIEW, SITE_URL } from "@/lib/config";

// Read SITE_PREVIEW and SITE_URL when requested, not at build time, so changing them only needs a restart.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (IS_PREVIEW) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
