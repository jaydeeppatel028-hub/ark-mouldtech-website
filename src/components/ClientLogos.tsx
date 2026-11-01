import Image from "next/image";
import type { Client } from "@/content/site";
import { IS_PREVIEW } from "@/lib/config";

/**
 * Client logo showcase. The homepage, Why Choose Us and Contact pages all
 * read the same client list, so a logo is uploaded once in the admin panel.
 */
export function ClientLogos({ clients, compact = false }: { clients: Client[]; compact?: boolean }) {
  const items: { key: string; node: React.ReactNode }[] = clients.length
    ? clients.map((c) => ({
        key: c.name,
        node: c.logo ? (
          <Image src={c.logo.src} alt={c.logo.alt || c.name} width={c.logo.width} height={c.logo.height} className="max-h-16 w-auto object-contain" />
        ) : (
          <span className="font-head text-[14px] font-bold text-ink">{c.name}</span>
        ),
      }))
    : IS_PREVIEW
      ? Array.from({ length: 8 }, (_, i) => ({
          key: `slot-${i}`,
          node: (
            <span>
              <b className="block font-head text-[13px] text-[#9aa0ac]">Client logo {i + 1}</b>
              Upload from admin
            </span>
          ),
        }))
      : [];

  if (!items.length) return null;

  const tile = (key: string, node: React.ReactNode, hidden?: boolean) => (
    <div
      key={key}
      aria-hidden={hidden || undefined}
      className={`grid h-24 w-[190px] flex-none place-items-center p-3 text-center text-[12px] leading-snug text-muted ${clients.length ? "border border-line bg-white" : "dash-slot"}`}
    >
      {node}
    </div>
  );

  if (compact) {
    return <div className="flex flex-wrap gap-3">{items.map((it) => tile(it.key, it.node))}</div>;
  }

  return (
    <div
      className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
      aria-label="Client logos"
    >
      <div className="animate-marquee flex w-max gap-4">
        {items.map((it) => tile(it.key, it.node))}
        {items.map((it) => tile(`${it.key}-dup`, it.node, true))}
      </div>
    </div>
  );
}
