import { eq } from "drizzle-orm";
import { db, hasDatabase, schema } from "@/db";

// Uploaded images are stored in the database so they survive redeploys and are included in database backups.
// A replaced image always gets a new id, so responses can be cached for a long time.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const num = Number(id);
  if (!hasDatabase() || !Number.isInteger(num) || num <= 0) return new Response("Not found", { status: 404 });
  const [row] = await db().select({ mime: schema.media.mime, data: schema.media.data }).from(schema.media).where(eq(schema.media.id, num)).limit(1);
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
