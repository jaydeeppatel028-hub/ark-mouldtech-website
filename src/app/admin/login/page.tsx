import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { login } from "@/admin/auth-actions";
import { AuthForm } from "@/admin/AuthForm";
import { currentAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: { absolute: "Sign in | ARK Mouldtech Admin" }, robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  return (
    <div className="grid min-h-screen place-items-center bg-mist px-4 py-10">
      <div className="w-full max-w-sm border border-line bg-white p-7">
        <Image src="/brand/ark-logo.webp" alt="ARK logo" width={978} height={497} className="mb-5 h-12 w-auto" />
        <h1 className="mb-5 text-[22px] font-extrabold">Admin sign in</h1>
        <AuthForm
          action={login}
          submitLabel="Sign in"
          inputs={[
            { name: "email", label: "Email", type: "email", autoComplete: "username" },
            { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
          ]}
        />
      </div>
    </div>
  );
}
