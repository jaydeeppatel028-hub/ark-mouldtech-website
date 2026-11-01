import "server-only";
import { sql } from "drizzle-orm";
import { db, hasDatabase } from "@/db";

/**
 * At most `limit` hits per `windowMs` for a key. Uses the database when
 * available so limits hold across restarts, otherwise process memory.
 * Returns true when the hit is allowed.
 */
const memory = new Map<string, { hits: number; resetAt: number }>();

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now();
  if (!hasDatabase()) {
    const e = memory.get(key);
    if (!e || e.resetAt <= now) {
      memory.set(key, { hits: 1, resetAt: now + windowMs });
      if (memory.size > 5000) for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
      return true;
    }
    e.hits++;
    return e.hits <= limit;
  }
  const resetAt = new Date(now + windowMs);
  // Insert, or bump the counter; start a fresh window if the old one expired.
  await db().execute(sql`
    INSERT INTO rate_limits (\`key\`, hits, reset_at) VALUES (${key}, 1, ${resetAt})
    ON DUPLICATE KEY UPDATE
      hits = IF(reset_at <= UTC_TIMESTAMP(), 1, hits + 1),
      reset_at = IF(reset_at <= UTC_TIMESTAMP(), VALUES(reset_at), reset_at)
  `);
  const [rows] = (await db().execute(sql`SELECT hits FROM rate_limits WHERE \`key\` = ${key}`)) as unknown as [{ hits: number }[]];
  return (rows[0]?.hits ?? 0) <= limit;
}

export async function clearRateLimit(key: string) {
  if (!hasDatabase()) {
    memory.delete(key);
    return;
  }
  await db().execute(sql`DELETE FROM rate_limits WHERE \`key\` = ${key}`);
}
