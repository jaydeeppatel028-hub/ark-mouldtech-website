import { readFile } from "node:fs/promises";
import path from "node:path";
import { count, eq } from "drizzle-orm";
import type { MySqlTable } from "drizzle-orm/mysql-core";
import type { MySql2Database } from "drizzle-orm/mysql2";
import type mysql from "mysql2/promise";
import * as seed from "../content/site";
import * as schema from "./schema";

// No "server-only" import: used by the setup page and by command-line scripts.

/** Creates any missing tables. Safe to run repeatedly. */
export async function createTables(conn: mysql.Pool | mysql.Connection) {
  const sqlText = await readFile(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  const statements = sqlText
    .split(/;\s*(?:\r?\n|$)/)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);
  for (const stmt of statements) await conn.query(stmt);
}

/** Fills empty tables with the starting content. Never overwrites existing data. */
export async function seedIfEmpty(db: MySql2Database<typeof schema>) {
  const empty = async (table: MySqlTable) => {
    const [r] = await db.select({ n: count() }).from(table);
    return Number(r?.n ?? 0) === 0;
  };

  if (await empty(schema.categories)) {
    await db.insert(schema.categories).values(
      seed.categories.map((c, i) => ({ slug: c.slug, name: c.name, groupName: c.group, summary: c.summary, featured: c.featured, sort: i })),
    );
  }
  if (await empty(schema.products)) {
    const cats = await db.select({ id: schema.categories.id, slug: schema.categories.slug }).from(schema.categories);
    const idBySlug = new Map(cats.map((c) => [c.slug, c.id]));
    const rows = seed.products
      .filter((p) => idBySlug.has(p.category))
      .map((p, i) => ({ slug: p.slug, name: p.name, categoryId: idBySlug.get(p.category)!, description: p.description ?? null, sort: i }));
    if (rows.length) await db.insert(schema.products).values(rows);
  }
  if (await empty(schema.machines)) {
    await db.insert(schema.machines).values(seed.machines.map((m, i) => ({ name: m.name, quantity: m.quantity, sort: i })));
  }
  if (await empty(schema.gallery)) {
    await db.insert(schema.gallery).values(seed.gallery.map((g, i) => ({ caption: g.caption, sort: i })));
  }
  for (const [key, value] of [
    ["company", seed.company],
    ["seo", seed.seo],
  ] as const) {
    const [row] = await db.select({ key: schema.settings.key }).from(schema.settings).where(eq(schema.settings.key, key)).limit(1);
    if (!row) await db.insert(schema.settings).values({ key, value });
  }
}
