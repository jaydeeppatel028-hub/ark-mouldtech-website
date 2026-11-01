/**
 * Creates an admin login, or resets the password of an existing one.
 * Usage: DATABASE_URL=... npm run admin:create -- owner@example.com "Owner Name"
 * You will be asked for the password (or set ADMIN_PASSWORD).
 */
import { createInterface } from "node:readline/promises";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../src/db/schema";
import { hashPassword, passwordProblem } from "../src/lib/password";

async function main() {
  const [email, name = "Administrator"] = process.argv.slice(2);
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL first.");
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Usage: npm run admin:create -- you@example.com "Your Name"');
  let password = process.env.ADMIN_PASSWORD ?? "";
  if (!password) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    password = await rl.question("Password (at least 12 characters, with a letter and a number): ");
    rl.close();
  }
  const problem = passwordProblem(password);
  if (problem) throw new Error(problem);

  const pool = mysql.createPool({ uri: process.env.DATABASE_URL, timezone: "Z" });
  const db = drizzle(pool, { schema, mode: "default" });
  const passwordHash = await hashPassword(password);
  const [existing] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email.toLowerCase())).limit(1);
  if (existing) {
    await db.update(schema.adminUsers).set({ passwordHash, name }).where(eq(schema.adminUsers.id, existing.id));
    await db.delete(schema.sessions).where(eq(schema.sessions.userId, existing.id));
    console.log(`Password updated for ${email}.`);
  } else {
    await db.insert(schema.adminUsers).values({ email: email.toLowerCase(), name, passwordHash });
    console.log(`Admin ${email} created.`);
  }
  await pool.end();
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
