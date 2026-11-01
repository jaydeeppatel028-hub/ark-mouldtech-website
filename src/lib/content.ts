import "server-only";
import { asc, eq, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import * as seed from "@/content/site";
import type { Category, Client, Company, GalleryItem, Machine, PageSeo, Photo, Product, Testimonial } from "@/content/site";
import { db, hasDatabase, schema } from "@/db";

/**
 * Content access layer. Public pages only talk to these functions.
 * With DATABASE_URL set, content comes from MySQL (edited in /admin) and is
 * cached until an admin change calls revalidateTag(CONTENT_TAG).
 * Without it, the starter content in src/content/site.ts is used.
 */
export const CONTENT_TAG = "content";

function cached<T>(key: string, fn: () => Promise<T>): () => Promise<T> {
  return unstable_cache(fn, [key], { tags: [CONTENT_TAG] });
}

export type SeoSettings = Record<keyof typeof seed.seo, PageSeo & { keywords?: string }>;

export const mediaUrl = (id: number) => `/media/${id}`;

async function photoMap(ids: (number | null | undefined)[]): Promise<Map<number, Photo>> {
  const wanted = [...new Set(ids.filter((i): i is number => typeof i === "number"))];
  const map = new Map<number, Photo>();
  if (!wanted.length) return map;
  const rows = await db()
    .select({ id: schema.media.id, width: schema.media.width, height: schema.media.height, alt: schema.media.alt })
    .from(schema.media)
    .where(inArray(schema.media.id, wanted));
  for (const r of rows) map.set(r.id, { src: mediaUrl(r.id), width: r.width, height: r.height, alt: r.alt });
  return map;
}

async function getSetting<T>(key: string): Promise<T | null> {
  const [row] = await db().select().from(schema.settings).where(eq(schema.settings.key, key)).limit(1);
  if (!row) return null;
  return (typeof row.value === "string" ? JSON.parse(row.value) : row.value) as T;
}

const dbCompany = cached("company", async () => ({ ...seed.company, ...((await getSetting<Partial<Company>>("company")) ?? {}) }));

const dbCategories = cached("categories", async () => {
  const rows = await db().select().from(schema.categories).orderBy(asc(schema.categories.sort), asc(schema.categories.id));
  const photos = await photoMap(rows.map((r) => r.photoId));
  return rows.map<Category & { id: number }>((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    group: r.groupName,
    summary: r.summary,
    featured: r.featured,
    photo: r.photoId ? photos.get(r.photoId) : undefined,
  }));
});

const dbProducts = cached("products", async () => {
  const [rows, cats] = await Promise.all([
    db().select().from(schema.products).where(eq(schema.products.published, true)).orderBy(asc(schema.products.sort), asc(schema.products.id)),
    db().select({ id: schema.categories.id, slug: schema.categories.slug }).from(schema.categories),
  ]);
  const slugById = new Map(cats.map((c) => [c.id, c.slug]));
  const photos = await photoMap(rows.map((r) => r.photoId));
  return rows.map<Product>((r) => ({
    slug: r.slug,
    name: r.name,
    category: slugById.get(r.categoryId) ?? "",
    description: r.description ?? undefined,
    material: r.material ?? undefined,
    dimensions: r.dimensions ?? undefined,
    specifications: r.specifications ?? undefined,
    applications: r.applications ?? undefined,
    photo: r.photoId ? photos.get(r.photoId) : undefined,
  }));
});

const dbMachines = cached("machines", async () => {
  const rows = await db().select().from(schema.machines).orderBy(asc(schema.machines.sort), asc(schema.machines.id));
  const photos = await photoMap(rows.map((r) => r.photoId));
  return rows.map<Machine>((r) => ({
    name: r.name,
    quantity: r.quantity,
    brand: r.brand ?? undefined,
    model: r.model ?? undefined,
    size: r.size ?? undefined,
    xTravel: r.xTravel ?? undefined,
    yTravel: r.yTravel ?? undefined,
    zTravel: r.zTravel ?? undefined,
    tableSize: r.tableSize ?? undefined,
    maxCapacity: r.maxCapacity ?? undefined,
    other: r.other ?? undefined,
    photo: r.photoId ? photos.get(r.photoId) : undefined,
  }));
});

const dbGallery = cached("gallery", async () => {
  const rows = await db().select().from(schema.gallery).orderBy(asc(schema.gallery.sort), asc(schema.gallery.id));
  const photos = await photoMap(rows.map((r) => r.photoId));
  return rows.map<GalleryItem>((r) => ({
    caption: r.caption,
    description: r.description ?? undefined,
    photo: r.photoId ? photos.get(r.photoId) : undefined,
  }));
});

const dbClients = cached("clients", async () => {
  const rows = await db().select().from(schema.clients).orderBy(asc(schema.clients.sort), asc(schema.clients.id));
  const photos = await photoMap(rows.map((r) => r.logoId));
  return rows.map<Client>((r) => ({ name: r.name, website: r.website ?? undefined, logo: r.logoId ? photos.get(r.logoId) : undefined }));
});

const dbTestimonials = cached("testimonials", async () => {
  const rows = await db()
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.published, true))
    .orderBy(asc(schema.testimonials.sort), asc(schema.testimonials.id));
  const photos = await photoMap(rows.flatMap((r) => [r.screenshotId, r.logoId]));
  return rows.map<Testimonial>((r) => ({
    customerName: r.customerName,
    companyName: r.companyName ?? undefined,
    review: r.review ?? undefined,
    screenshot: r.screenshotId ? photos.get(r.screenshotId) : undefined,
    logo: r.logoId ? photos.get(r.logoId) : undefined,
  }));
});

const dbSeo = cached("seo", async () => {
  const saved = (await getSetting<Partial<SeoSettings>>("seo")) ?? {};
  const out = { ...seed.seo } as SeoSettings;
  for (const k of Object.keys(out) as (keyof SeoSettings)[]) out[k] = { ...out[k], ...(saved[k] ?? {}) };
  return out;
});

export async function getCompany(): Promise<Company> {
  return hasDatabase() ? dbCompany() : seed.company;
}
export async function getCategories(): Promise<Category[]> {
  return hasDatabase() ? dbCategories() : seed.categories;
}
export async function getFeaturedCategories() {
  return (await getCategories()).filter((c) => c.featured);
}
export async function getProducts(): Promise<Product[]> {
  return hasDatabase() ? dbProducts() : seed.products;
}
export async function getMachines(): Promise<Machine[]> {
  return hasDatabase() ? dbMachines() : seed.machines;
}
export async function getGallery(): Promise<GalleryItem[]> {
  return hasDatabase() ? dbGallery() : seed.gallery;
}
export async function getClients(): Promise<Client[]> {
  return hasDatabase() ? dbClients() : seed.clients;
}
export async function getTestimonials(): Promise<Testimonial[]> {
  return hasDatabase() ? dbTestimonials() : seed.testimonials;
}
export async function getReasons() {
  return seed.reasons;
}
export async function getCoreValues() {
  return seed.coreValues;
}
export async function getSeo(page: keyof typeof seed.seo): Promise<PageSeo & { keywords?: string }> {
  return hasDatabase() ? (await dbSeo())[page] : seed.seo[page];
}
