import "server-only";
import { eq, inArray } from "drizzle-orm";
import sharp from "sharp";
import { db, schema } from "@/db";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["jpeg", "png", "webp"]);

export type ImageKind = "photo" | "logo" | "screenshot";
const MAX_EDGE: Record<ImageKind, number> = { photo: 2000, logo: 800, screenshot: 1800 };

export class UploadError extends Error {}

/**
 * Checks an uploaded image by decoding it (not by trusting its name or type),
 * fixes rotation, shrinks it, strips metadata, converts to WebP and stores it.
 * Returns the new media id.
 */
export async function saveUpload(file: File, kind: ImageKind, alt: string): Promise<number> {
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Images must be 10 MB or smaller.");
  const input = Buffer.from(await file.arrayBuffer());
  let meta: sharp.Metadata;
  try {
    meta = await sharp(input).metadata();
  } catch {
    throw new UploadError("That file is not a readable image. Use JPG, PNG or WebP.");
  }
  if (!meta.format || !ALLOWED.has(meta.format)) throw new UploadError("Use a JPG, PNG or WebP image.");
  if ((meta.width ?? 0) * (meta.height ?? 0) > 60_000_000) throw new UploadError("That image is too large in pixels.");

  const edge = MAX_EDGE[kind];
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
    .webp({ quality: kind === "logo" ? 90 : 82 })
    .toBuffer({ resolveWithObject: true });

  const [res] = await db()
    .insert(schema.media)
    .values({ mime: "image/webp", width: info.width, height: info.height, bytes: data.length, data, alt: alt.slice(0, 255) })
    .$returningId();
  return res.id;
}

export async function setMediaAlt(id: number, alt: string) {
  await db().update(schema.media).set({ alt: alt.slice(0, 255) }).where(eq(schema.media.id, id));
}

export async function deleteMedia(ids: (number | null | undefined)[]) {
  const list = ids.filter((i): i is number => typeof i === "number");
  if (list.length) await db().delete(schema.media).where(inArray(schema.media.id, list));
}
