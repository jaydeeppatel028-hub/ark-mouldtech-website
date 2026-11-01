import "server-only";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

export type DB = MySql2Database<typeof schema>;

const globalForDb = globalThis as unknown as { __arkPool?: mysql.Pool; __arkDb?: DB };

/** True when DATABASE_URL is set. Without it the site falls back to the starter content. */
export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function db(): DB {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!globalForDb.__arkDb) {
    globalForDb.__arkPool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 5,
      waitForConnections: true,
      enableKeepAlive: true,
      timezone: "Z",
    });
    globalForDb.__arkDb = drizzle(globalForDb.__arkPool, { schema, mode: "default" });
  }
  return globalForDb.__arkDb;
}

export { schema };
