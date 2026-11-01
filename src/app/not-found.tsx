import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="band">
      <div className="wrap grid justify-items-start gap-4">
        <Link href="/" aria-label="ARK Mouldtech Solutions, home">
          <Image src="/brand/ark-logo.webp" alt="ARK logo" width={978} height={497} sizes="96px" className="mb-4 h-12 w-auto" />
        </Link>
        <span className="eyebrow">Page not found</span>
        <h1 className="h2">We couldn&apos;t find that page</h1>
        <p className="lead">The link may be old or mistyped. Try one of these instead.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-red">
            Go to Home
          </Link>
          <Link href="/products" className="btn btn-dark">
            Products &amp; Services
          </Link>
          <Link href="/contact" className="btn btn-dark">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
