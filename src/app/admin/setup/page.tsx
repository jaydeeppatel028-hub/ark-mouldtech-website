import type { Metadata } from "next";
import { count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { runSetup } from "@/admin/auth-actions";
import { AuthForm } from "@/admin/AuthForm";
import { db, hasDatabase, schema } from "@/db";

export const metadata: Metadata = { title: { absolute: "Setup | ARK Mouldtech Admin" }, robots: { index: false, follow: false } };

async function adminExists() {
  try {
    const [{ n }] = await db().select({ n: count() }).from(schema.adminUsers);
    return Number(n) > 0;
  } catch {
    return false; // tables not created yet
  }
}

export default async function SetupPage() {
  if (hasDatabase() && (await adminExists())) redirect("/admin/login");
  const ready = hasDatabase() && (process.env.SETUP_TOKEN ?? "").length >= 16;
  return (
    <div className="grid min-h-screen place-items-center bg-mist px-4 py-10">
      <div className="w-full max-w-md border border-line bg-white p-7">
        <h1 className="mb-2 text-[22px] font-extrabold">First-time setup</h1>
        <p className="mb-5 text-[14px] text-muted">Creates the database tables, adds the starting content and your admin login. This page stops working once an admin exists.</p>
        {ready ? (
          <AuthForm
            action={runSetup}
            submitLabel="Set up website"
            inputs={[
              { name: "token", label: "Setup code", type: "password", help: "The SETUP_TOKEN value from the server settings." },
              { name: "name", label: "Your name", autoComplete: "name" },
              { name: "email", label: "Your email", type: "email", autoComplete: "username" },
              { name: "password", label: "Choose a password", type: "password", autoComplete: "new-password", help: "At least 12 characters, with a letter and a number." },
            ]}
          />
        ) : (
          <p className="border-l-4 border-brand-blue bg-blue-50 px-4 py-3 text-[14px]">
            Add DATABASE_URL and SETUP_TOKEN (16+ characters) to the server&apos;s environment variables, restart the app, then reload this page.
          </p>
        )}
      </div>
    </div>
  );
}
