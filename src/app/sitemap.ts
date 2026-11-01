import type { MetadataRoute } from "next";
import { NAV, SITE_URL } from "@/lib/config";

// Read SITE_URL (and SITE_PREVIEW) when requested, not at build time, so changing them only needs a restart.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  return NAV.map((n) => ({
    url: `${SITE_URL}${n.href === "/" ? "" : n.href}`,
    changeFrequency: "monthly",
    priority: n.href === "/" ? 1 : 0.8,
  }));
}
