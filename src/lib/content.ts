import "server-only";
import * as seed from "@/content/site";

/**
 * Content access layer. Pages only talk to these functions.
 * Step 3 swaps the bodies for MySQL queries; the pages stay the same.
 */
export async function getCompany() {
  return seed.company;
}
export async function getCategories() {
  return seed.categories;
}
export async function getFeaturedCategories() {
  return seed.categories.filter((c) => c.featured);
}
export async function getProducts() {
  return seed.products;
}
export async function getProductBySlug(slug: string) {
  return seed.products.find((p) => p.slug === slug) ?? null;
}
export async function getMachines() {
  return seed.machines;
}
export async function getGallery() {
  return seed.gallery;
}
export async function getClients() {
  return seed.clients;
}
export async function getTestimonials() {
  return seed.testimonials;
}
export async function getReasons() {
  return seed.reasons;
}
export async function getCoreValues() {
  return seed.coreValues;
}
export async function getSeo(page: keyof typeof seed.seo) {
  return seed.seo[page];
}
