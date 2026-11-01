import { changePassword } from "@/admin/auth-actions";
import { AuthForm } from "@/admin/AuthForm";
import { AdminTitle } from "@/admin/ui";
import { requireAdmin } from "@/lib/auth";

export default async function AccountPage() {
  const me = await requireAdmin();
  return (
    <>
      <AdminTitle title="Change password" intro={`Signed in as ${me.email}. Changing the password signs out every other device.`} />
      <div className="max-w-md border border-line bg-white p-6">
        <AuthForm
          action={changePassword}
          submitLabel="Change password"
          inputs={[
            { name: "current", label: "Current password", type: "password", autoComplete: "current-password" },
            { name: "next", label: "New password", type: "password", autoComplete: "new-password", help: "At least 12 characters, with a letter and a number." },
            { name: "confirm", label: "New password again", type: "password", autoComplete: "new-password" },
          ]}
        />
      </div>
    </>
  );
}
