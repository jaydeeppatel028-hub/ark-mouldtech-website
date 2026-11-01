import type { Reason } from "@/content/site";
import { Icon } from "./Icon";

/** Bordered grid of "why choose us" points. `detailed` uses the longer text. */
export function ReasonsGrid({ reasons, detailed = false }: { reasons: Reason[]; detailed?: boolean }) {
  return (
    <div className="grid border-t border-l border-line sm:grid-cols-2">
      {reasons.map((r) => (
        <div key={r.title} className="grid grid-cols-[44px_1fr] items-start gap-4 border-r border-b border-line px-6 py-[26px]">
          <div className="grid h-11 w-11 place-items-center bg-mist text-brand-blue">
            <Icon name={r.icon} className="h-[22px] w-[22px]" />
          </div>
          <div>
            <h3 className="mb-1 text-[16px] font-bold">{r.title}</h3>
            <p className="text-[14px] text-muted">{detailed ? r.long : r.short}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
