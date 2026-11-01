import { CtaBanner } from "@/components/CtaBanner";
import { Gallery } from "@/components/Gallery";
import { PageHeader } from "@/components/PageHeader";
import { PhotoSlot } from "@/components/PhotoSlot";
import type { Machine } from "@/content/site";
import { IS_PREVIEW } from "@/lib/config";
import { getCompany, getGallery, getMachines } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("infrastructure", "/infrastructure");

const SPEC_FIELDS: [keyof Machine, string][] = [
  ["brand", "Manufacturer / Brand"],
  ["model", "Model"],
  ["size", "Machine size"],
  ["xTravel", "X-axis travel"],
  ["yTravel", "Y-axis travel"],
  ["zTravel", "Z-axis travel"],
  ["tableSize", "Table size"],
  ["maxCapacity", "Maximum capacity"],
  ["other", "Other specifications"],
];

export default async function InfrastructurePage() {
  const [company, machines, gallery] = await Promise.all([getCompany(), getMachines(), getGallery()]);
  const totalMachines = machines.reduce((n, m) => n + (Number(m.quantity) || 0), 0);

  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Our Manufacturing Infrastructure"
        intro="Our manufacturing facility is equipped with modern machining, tooling and inspection equipment to support a wide range of precision manufacturing requirements."
        crumbs={[{ href: "/", label: "Home" }, { label: "Infrastructure" }]}
      />

      {/* Summary strip */}
      <section className="border-b border-line bg-white">
        <dl className="wrap grid grid-cols-2 md:grid-cols-4">
          {[
            [company.workshopArea, "Workshop area"],
            [String(totalMachines), "Machines & equipment"],
            ["VMC + EDM", "Machining centres"],
            ["Sanand GIDC", "Ahmedabad, Gujarat"],
          ].map(([v, l], i) => (
            <div key={l} className={`grid gap-0.5 py-6 ${i % 2 ? "border-l border-line pl-5" : "pr-5"} ${i >= 2 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l md:pl-5" : ""}`}>
              <dt className="order-2 text-[13px] text-muted">{l}</dt>
              <dd className="order-1 font-head text-[22px] font-extrabold text-ink tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Machines */}
      <section className="band bg-mist">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Machinery</span>
              <h2 className="h2">Machines and Equipment</h2>
              <p className="lead">Detailed specifications for each machine will be added here.</p>
            </div>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {machines.map((m) => {
              const specs = SPEC_FIELDS.filter(([k]) => m[k]);
              return (
                <li key={m.name} className="flex flex-col bg-white">
                  <PhotoSlot photo={m.photo} label={m.name} light className="aspect-[4/3]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px" />
                  <div className="grid gap-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[16px] font-bold">{m.name}</h3>
                      <span className="flex-none bg-ink px-2 py-0.5 font-head text-[12px] font-bold text-white tabular-nums">
                        {/^\d+$/.test(m.quantity) ? `× ${m.quantity}` : m.quantity}
                      </span>
                    </div>
                    {specs.length > 0 && (
                      <dl className="grid gap-1.5 border-t border-line pt-3 text-[13.5px]">
                        {specs.map(([k, label]) => (
                          <div key={k} className="flex justify-between gap-3">
                            <dt className="text-muted">{label}</dt>
                            <dd className="text-right font-medium text-ink">{String(m[k])}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      {(IS_PREVIEW || gallery.some((g) => g.photo)) && (
        <section className="band">
          <div className="wrap">
            <div className="shead">
              <div>
                <span className="eyebrow">Gallery</span>
                <h2 className="h2">Inside Our Workshop</h2>
                <p className="lead">Tap a photo to view it full screen.</p>
              </div>
            </div>
            <Gallery items={gallery} preview={IS_PREVIEW} />
          </div>
        </section>
      )}

      <section className="on-dark bg-night py-14">
        <div className="wrap grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
          <PhotoSlot label="Workshop interior, wide shot" className="aspect-video" sizes="(max-width: 768px) 100vw, 520px" />
          <div className="grid gap-3">
            <span className="eyebrow">Workshop</span>
            <h2 className="h2">{company.workshopArea} of Tool Room Space</h2>
            <p className="lead">
              VMC and EDM machining, grinding, milling, turning and inspection all happen under one roof in Sanand GIDC.
            </p>
          </div>
        </div>
      </section>

      <CtaBanner phone={company.phone} />
    </>
  );
}
