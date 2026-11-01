import { saveSeo } from "@/admin/settings-actions";
import { SettingsForm } from "@/admin/SettingsForm";
import { AdminTitle, Notice } from "@/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getSeo } from "@/lib/content";

const PAGES = [
  ["home", "Home"],
  ["about", "About Us"],
  ["products", "Products & Services"],
  ["infrastructure", "Infrastructure"],
  ["why", "Why Choose Us"],
  ["contact", "Contact Us"],
] as const;

export default async function SeoPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const values = await Promise.all(PAGES.map(([k]) => getSeo(k)));
  return (
    <>
      <AdminTitle
        title="Search engine settings"
        intro="What Google shows for each page. Keep titles under 60 characters and descriptions under 160. Image descriptions are set on each photo."
      />
      {sp.saved && <Notice>Saved.</Notice>}
      <SettingsForm action={saveSeo}>
        {PAGES.map(([key, label], i) => (
          <fieldset key={key} className="grid gap-4 border border-line bg-white p-5">
            <legend className="px-1 font-semibold">{label}</legend>
            <div className="field">
              <label htmlFor={`${key}-t`}>Page title</label>
              <input id={`${key}-t`} name={`${key}.title`} defaultValue={values[i].title} maxLength={70} required />
            </div>
            <div className="field">
              <label htmlFor={`${key}-d`}>Description</label>
              <textarea id={`${key}-d`} name={`${key}.description`} defaultValue={values[i].description} maxLength={170} rows={2} required />
            </div>
            <div className="field">
              <label htmlFor={`${key}-k`}>Keywords (optional)</label>
              <input id={`${key}-k`} name={`${key}.keywords`} defaultValue={values[i].keywords ?? ""} maxLength={300} />
              <span className="text-[12.5px] text-muted">Separate with commas. Google mostly ignores these, so the title and description matter more.</span>
            </div>
          </fieldset>
        ))}
      </SettingsForm>
    </>
  );
}
