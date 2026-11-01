"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { redirect } from "next/navigation";
import { db, hasDatabase, schema } from "@/db";
import { createTables, seedIfEmpty } from "@/db/setup";
import { createSession, requireAdmin, signOutEverywhere } from "@/lib/auth";
import { clientIp } from "@/lib/client-ip";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/password";
import { clearRateLimit, rateLimit } from "@/lib/rate-limit";

/** Constant-time comparison, so response timing does not reveal how much of a secret matched. */
function sameSecret(given: string, expected: string) {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export type AuthState = { error?: string; ok?: string } | undefined;

// A fixed hash to compare against when the email is unknown, so timing does not reveal which emails exist.
const DUMMY_HASH = "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86) + "==";

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasDatabase()) return { error: "The database is not connected yet." };
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 150);
  const password = String(formData.get("password") ?? "").slice(0, 200);
  const ip = await clientIp();
  const keyUser = `login:${ip}:${email}`;
  // The per-email cap still holds if someone fakes their IP address in request headers.
  const keyEmail = `login-email:${email}`;
  const okIp = await rateLimit(`login-ip:${ip}`, 30, 15 * 60 * 1000);
  const okUser = await rateLimit(keyUser, 5, 15 * 60 * 1000);
  const okEmail = await rateLimit(keyEmail, 20, 60 * 60 * 1000);
  if (!okIp || !okUser) return { error: "Too many sign-in attempts. Wait 15 minutes and try again." };
  if (!okEmail) return { error: "Too many sign-in attempts for this account. Wait an hour and try again." };

  const [user] = await db().select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email)).limit(1);
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) return { error: "Email or password is incorrect." };

  await clearRateLimit(keyUser);
  await clearRateLimit(keyEmail);
  await createSession(user.id);
  redirect("/admin");
}

export async function changePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const me = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const [user] = await db().select().from(schema.adminUsers).where(eq(schema.adminUsers.id, me.id)).limit(1);
  if (!user || !(await verifyPassword(current, user.passwordHash))) return { error: "Your current password is incorrect." };
  const problem = passwordProblem(next);
  if (problem) return { error: problem };
  if (next !== confirm) return { error: "The two new passwords do not match." };
  await db().update(schema.adminUsers).set({ passwordHash: await hashPassword(next) }).where(eq(schema.adminUsers.id, me.id));
  await signOutEverywhere(me.id);
  await createSession(me.id);
  return { ok: "Password changed. Other devices have been signed out." };
}

/**
 * First-time setup: creates tables, adds starting content and the first admin.
 * Works only while no admin exists AND the SETUP_TOKEN environment variable matches.
 */
export async function runSetup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasDatabase()) return { error: "Set DATABASE_URL on the server first." };
  const expected = process.env.SETUP_TOKEN;
  if (!expected || expected.length < 16) return { error: "Set a SETUP_TOKEN of at least 16 characters on the server first." };
  const ip = await clientIp();
  if (!(await rateLimit(`setup:${ip}`, 10, 15 * 60 * 1000).catch(() => true))) return { error: "Too many attempts. Wait 15 minutes." };
  if (!sameSecret(String(formData.get("token") ?? ""), expected)) return { error: "Setup code is incorrect." };

  const pool = (db() as unknown as { $client: import("mysql2/promise").Pool }).$client;
  await createTables(pool);
  const [{ n }] = await db().select({ n: count() }).from(schema.adminUsers);
  if (Number(n) > 0) return { error: "Setup has already been completed. Sign in instead." };
  await seedIfEmpty(drizzle(pool, { schema, mode: "default" }));

  const name = String(formData.get("name") ?? "").trim().slice(0, 100) || "Administrator";
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 150);
  const password = String(formData.get("password") ?? "");
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address." };
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  const [res] = await db().insert(schema.adminUsers).values({ name, email, passwordHash: await hashPassword(password) }).$returningId();
  await createSession(res.id);
  redirect("/admin");
}
