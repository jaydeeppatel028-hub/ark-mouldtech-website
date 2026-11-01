import { saveCompany } from "@/admin/settings-actions";
import { SettingsForm } from "@/admin/SettingsForm";
import { AdminTitle, Notice } from "@/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getCompany } from "@/lib/content";

function F({ name, label, value, help, area, rows }: { name: string; label: string; value?: string | number; help?: string; area?: boolean; rows?: number }) {
  return (
    <div className="field">
      <label htmlFor={`c-${name}`}>{label}</label>
      {area ? <textarea id={`c-${name}`} name={name} defaultValue={value ?? ""} rows={rows ?? 4} /> : <input id={`c-${name}`} name={name} defaultValue={value ?? ""} />}
      {help && <span className="text-[12.5px] text-muted">{help}</span>}
    </div>
  );
}

export default async function CompanyPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requireAdmin();
  const c = await getCompany();
  const sp = await searchParams;
  const emails = [0, 1, 2].map((i) => c.emails[i]);
  return (
    <>
      <AdminTitle title="Company information" intro="Used in the header, footer, Contact page, About page and Google listing details." />
      {sp.saved && <Notice>Saved.</Notice>}
      <SettingsForm action={saveCompany}>
        <fieldset className="grid gap-4 border border-line bg-white p-5">
          <legend className="px-1 font-semibold">Contact</legend>
          <F name="phone" label="Phone number" value={c.phone.display} />
          {emails.map((e, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[160px_1fr]">
              <F name={`emailLabel${i}`} label="Email label" value={e?.label ?? ["Sales", "Design", "Gmail"][i]} />
              <F name={`email${i}`} label={i === 0 ? "Email (main, receives inquiries)" : "Email (optional)"} value={e?.address} />
            </div>
          ))}
        </fieldset>
        <fieldset className="grid gap-4 border border-line bg-white p-5">
          <legend className="px-1 font-semibold">Address</legend>
          <F name="line1" label="Address line 1" value={c.address.line1} />
          <F name="line2" label="Address line 2" value={c.address.line2} />
          <div className="grid gap-4 sm:grid-cols-2">
            <F name="city" label="City" value={c.address.city} />
            <F name="state" label="State" value={c.address.state} />
            <F name="country" label="Country" value={c.address.country} />
            <F name="pincode" label="PIN code" value={c.address.pincode} />
          </div>
          <F name="mapQuery" label="Google Maps search text" value={c.mapQuery} help="What to search for on Google Maps to find your workshop." />
        </fieldset>
        <fieldset className="grid gap-4 border border-line bg-white p-5">
          <legend className="px-1 font-semibold">About the company</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <F name="established" label="Year established" value={c.established} />
            <F name="founder" label="Founder" value={c.founder} />
            <F name="workshopArea" label="Workshop area" value={c.workshopArea} />
          </div>
          <F name="intro" label="Short introduction (homepage)" value={c.intro} area />
          <F name="about" label="Company background (About page)" value={c.about.join("\n\n")} area rows={8} help="Leave a blank line between paragraphs." />
          <F name="vision" label="Vision" value={c.vision} area rows={3} />
          <F name="mission" label="Mission" value={c.mission} area rows={3} />
        </fieldset>
      </SettingsForm>
    </>
  );
}
