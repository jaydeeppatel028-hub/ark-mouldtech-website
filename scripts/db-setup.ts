/**
 * Creates the database tables and fills them with the starting content.
 * Usage: DATABASE_URL=mysql://user:pass@host:3306/dbname npm run db:setup
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../src/db/schema";
import { createTables, seedIfEmpty } from "../src/db/setup";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Set DATABASE_URL first, for example mysql://user:password@localhost:3306/ark");
  const pool = mysql.createPool({ uri: url, timezone: "Z" });
  await createTables(pool);
  await seedIfEmpty(drizzle(pool, { schema, mode: "default" }));
  await pool.end();
  console.log("Database ready.");
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
