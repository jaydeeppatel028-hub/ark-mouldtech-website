import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs before every page request.
 * 1. Adds a Content-Security-Policy with a fresh nonce, so the browser only runs
 *    scripts this site served (Next.js adds the nonce to its own scripts).
 * 2. Admin pages: redirects to the login page when there is no session cookie.
 *    This is only the first line of defence; every admin page and action checks
 *    the session on the server as well.
 */
const isDev = process.env.NODE_ENV !== "production";

function contentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    // Google Maps embed on the Contact page.
    "frame-src https://www.google.com https://maps.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) {
    const open = pathname === "/admin/login" || pathname === "/admin/setup";
    if (!open && !req.cookies.get("ark_admin")) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  const nonce = btoa(crypto.randomUUID());
  const csp = contentSecurityPolicy(nonce);
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  if (isAdmin) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store");
  }
  return res;
}

export const config = {
  // Everything except static files, optimised images and uploaded media (which sets its own strict policy).
  matcher: ["/((?!_next/static|_next/image|media/|brand/|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml).*)"],
};
