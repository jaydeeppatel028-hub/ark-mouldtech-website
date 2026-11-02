import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Browsers only honour this over HTTPS. One year, without preload, so it can still be undone.
  ...(process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] : []),
];
// The Content-Security-Policy is set per request in src/middleware.ts (it needs a fresh nonce).

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // NEXT_OUTPUT=standalone builds a self-contained server folder that can be
  // uploaded to hosts where building on the server is not allowed (see scripts/package-standalone.sh).
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" as const } : {}),
  // Always put page titles and descriptions in the <head> (no streamed metadata),
  // so every search engine and link preview sees them in the first HTML.
  htmlLimitedBots: /.*/,
  images: { formats: ["image/avif", "image/webp"] },
  // Admin photo uploads go through server actions; allow up to 10 MB images plus form overhead.
  experimental: { serverActions: { bodySizeLimit: "11mb" } },
  serverExternalPackages: ["mysql2", "sharp"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
