import "server-only";
import { schema } from "@/db";
import type { ImageKind } from "@/lib/media";

/**
 * Describes each editable list in the admin panel. One set of generic pages
 * and actions (list, add, edit, delete, reorder) works from these definitions.
 */
export type Field =
  | { name: string; label: string; type: "text" | "textarea" | "url"; required?: boolean; max: number; help?: string; rows?: number }
  | { name: string; label: string; type: "checkbox"; help?: string }
  | { name: string; label: string; type: "category"; required: true }
  | { name: string; label: string; type: "image"; kind: ImageKind; help?: string };

export type Collection = {
  key: string;
  title: string;
  singular: string;
  intro: string;
  table:
    | typeof schema.products
    | typeof schema.categories
    | typeof schema.machines
    | typeof schema.gallery
    | typeof schema.clients
    | typeof schema.testimonials;
  fields: Field[];
  /** Field shown as the row title in lists. */
  titleField: string;
  subtitle?: (row: Record<string, unknown>) => string;
  /** Image shown as the row thumbnail. */
  thumbField?: string;
  /** Build a URL slug from this field when the item is created. */
  slugFrom?: string;
  groupByCategory?: boolean;
};

export const collections: Collection[] = [
  {
    key: "products",
    title: "Products",
    singular: "product",
    intro: "Items listed on the Products & Services page. Each belongs to a category.",
    table: schema.products,
    titleField: "name",
    thumbField: "photoId",
    slugFrom: "name",
    groupByCategory: true,
    subtitle: (r) => (r.published ? "" : "Hidden from website"),
    fields: [
      { name: "name", label: "Product name", type: "text", required: true, max: 150 },
      { name: "categoryId", label: "Category", type: "category", required: true },
      { name: "photoId", label: "Product photo", type: "image", kind: "photo" },
      { name: "description", label: "Short description", type: "textarea", max: 2000, rows: 3 },
      { name: "material", label: "Material", type: "text", max: 500, help: "Optional. Leave empty to hide." },
      { name: "dimensions", label: "Dimensions", type: "text", max: 500, help: "Optional. Leave empty to hide." },
      { name: "specifications", label: "Technical specifications", type: "textarea", max: 4000, rows: 4, help: "Optional. One item per line works well." },
      { name: "applications", label: "Applications", type: "textarea", max: 2000, rows: 3, help: "Optional." },
      { name: "published", label: "Show on website", type: "checkbox" },
    ],
  },
  {
    key: "categories",
    title: "Product categories",
    singular: "category",
    intro: "The groups on the Products & Services page. Ticked ones also appear on the homepage.",
    table: schema.categories,
    titleField: "name",
    thumbField: "photoId",
    slugFrom: "name",
    subtitle: (r) => (r.featured ? "On homepage" : ""),
    fields: [
      { name: "name", label: "Category name", type: "text", required: true, max: 150 },
      { name: "groupName", label: "Small label above the name", type: "text", max: 100, help: "For example: Die & Mould Manufacturing" },
      { name: "summary", label: "Short description", type: "textarea", max: 500, rows: 2 },
      { name: "photoId", label: "Category photo", type: "image", kind: "photo", help: "Shown on the homepage card." },
      { name: "featured", label: "Show on homepage", type: "checkbox" },
    ],
  },
  {
    key: "machines",
    title: "Machines",
    singular: "machine",
    intro: "Shown on the Infrastructure page. Only the details you fill in are displayed.",
    table: schema.machines,
    titleField: "name",
    thumbField: "photoId",
    subtitle: (r) => `Quantity: ${r.quantity}`,
    fields: [
      { name: "name", label: "Machine name", type: "text", required: true, max: 150 },
      { name: "quantity", label: "Quantity", type: "text", required: true, max: 30, help: "A number, or a word like Multiple." },
      { name: "photoId", label: "Machine photo", type: "image", kind: "photo" },
      { name: "brand", label: "Manufacturer / brand", type: "text", max: 150 },
      { name: "model", label: "Model number", type: "text", max: 150 },
      { name: "size", label: "Machine size", type: "text", max: 150 },
      { name: "xTravel", label: "X-axis travel", type: "text", max: 60 },
      { name: "yTravel", label: "Y-axis travel", type: "text", max: 60 },
      { name: "zTravel", label: "Z-axis travel", type: "text", max: 60 },
      { name: "tableSize", label: "Table size", type: "text", max: 100 },
      { name: "maxCapacity", label: "Maximum capacity", type: "text", max: 150 },
      { name: "other", label: "Other specifications", type: "textarea", max: 2000, rows: 3 },
    ],
  },
  {
    key: "gallery",
    title: "Gallery",
    singular: "photo",
    intro: "Workshop photos on the Infrastructure page. Visitors can open them full screen.",
    table: schema.gallery,
    titleField: "caption",
    thumbField: "photoId",
    fields: [
      { name: "caption", label: "Caption", type: "text", required: true, max: 150 },
      { name: "photoId", label: "Photo", type: "image", kind: "photo" },
      { name: "description", label: "Description", type: "textarea", max: 500, rows: 2, help: "Optional, shown in full-screen view." },
    ],
  },
  {
    key: "clients",
    title: "Client logos",
    singular: "client",
    intro: "One list used on the homepage, Why Choose Us and Contact pages. Add only real clients.",
    table: schema.clients,
    titleField: "name",
    thumbField: "logoId",
    fields: [
      { name: "name", label: "Client name", type: "text", required: true, max: 150 },
      { name: "logoId", label: "Logo", type: "image", kind: "logo", help: "PNG with a transparent or white background works best." },
      { name: "website", label: "Website (optional)", type: "url", max: 255 },
    ],
  },
  {
    key: "testimonials",
    title: "Customer reviews",
    singular: "review",
    intro: "Reviews in the testimonial slider. Use a written review, a screenshot, or both.",
    table: schema.testimonials,
    titleField: "customerName",
    thumbField: "screenshotId",
    subtitle: (r) => [r.companyName, r.published ? "" : "Hidden"].filter(Boolean).join(" · "),
    fields: [
      { name: "customerName", label: "Customer name", type: "text", required: true, max: 150 },
      { name: "companyName", label: "Company name", type: "text", max: 150 },
      { name: "review", label: "Review text", type: "textarea", max: 3000, rows: 4 },
      { name: "screenshotId", label: "Review screenshot", type: "image", kind: "screenshot", help: "Shown at its original shape, never stretched." },
      { name: "logoId", label: "Customer or company logo", type: "image", kind: "logo" },
      { name: "published", label: "Show on website", type: "checkbox" },
    ],
  },
];

export function getCollection(key: string) {
  return collections.find((c) => c.key === key) ?? null;
}
