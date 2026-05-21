import { getSiteSettings } from "@/actions/admin/settings";
import { SettingsForm } from "@/components/admin/settings-form";
import { getAdminContext } from "@/lib/admin/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const { canWrite, canManageSettings } = await getAdminContext();
  const result = await getSiteSettings();
  const settings = result.success
    ? result.data
    : {
        siteName: "FreshStart UK",
        siteDescription: "",
        defaultOgImage: "",
        twitterHandle: "",
        disclosureText: "",
      };

  return (
    <div className="space-y-6">
      <h1 className="gradient-heading font-heading text-3xl font-bold">
        Settings
      </h1>
      <SettingsForm
        settings={settings}
        canChangePassword={canManageSettings}
        readOnly={!canWrite}
      />
    </div>
  );
}
