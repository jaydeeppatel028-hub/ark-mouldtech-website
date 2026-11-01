import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, hasDatabase, schema } from "@/db";

export const SESSION_COOKIE = "ark_admin";
const SESSION_DAYS = 7;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await db().insert(schema.sessions).values({ tokenHash: sha256(token), userId, expiresAt });
  // Housekeeping: drop expired sessions.
  await db().delete(schema.sessions).where(lt(schema.sessions.expiresAt, new Date()));
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token && hasDatabase()) await db().delete(schema.sessions).where(eq(schema.sessions.tokenHash, sha256(token)));
  jar.delete(SESSION_COOKIE);
}

export type AdminUser = { id: number; email: string; name: string };

export async function currentAdmin(): Promise<AdminUser | null> {
  if (!hasDatabase()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [row] = await db()
    .select({ id: schema.adminUsers.id, email: schema.adminUsers.email, name: schema.adminUsers.name })
    .from(schema.sessions)
    .innerJoin(schema.adminUsers, eq(schema.adminUsers.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.tokenHash, sha256(token)), gt(schema.sessions.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
}

/** Use at the top of every admin page and admin server action. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await currentAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

export async function signOutEverywhere(userId: number) {
  await db().delete(schema.sessions).where(eq(schema.sessions.userId, userId));
}
