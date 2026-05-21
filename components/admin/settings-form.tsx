"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  changeAdminPassword,
  saveSiteSettings,
} from "@/actions/admin/settings";
import type { SiteSettingsInput } from "@/lib/validations/admin/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForm({
  settings,
  canChangePassword,
  readOnly,
}: {
  settings: SiteSettingsInput;
  canChangePassword: boolean;
  readOnly?: boolean;
}) {
  const [site, setSite] = useState(settings);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pending, startTransition] = useTransition();

  function saveSettings() {
    startTransition(async () => {
      const result = await saveSiteSettings(site);
      if (result.success) toast.success("Settings saved");
      else toast.error(result.error);
    });
  }

  function savePassword() {
    startTransition(async () => {
      const result = await changeAdminPassword(passwords);
      if (result.success) {
        toast.success("Password updated");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else toast.error(result.error);
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <section className="glass rounded-xl p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold">Site metadata</h2>
        <div className="space-y-2">
          <Label>Site name</Label>
          <Input
            value={site.siteName}
            onChange={(e) => setSite({ ...site, siteName: e.target.value })}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={site.siteDescription}
            onChange={(e) =>
              setSite({ ...site, siteDescription: e.target.value })
            }
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label>Default OG image URL</Label>
          <Input
            type="url"
            value={site.defaultOgImage ?? ""}
            onChange={(e) =>
              setSite({ ...site, defaultOgImage: e.target.value })
            }
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label>Twitter handle</Label>
          <Input
            value={site.twitterHandle ?? ""}
            onChange={(e) =>
              setSite({ ...site, twitterHandle: e.target.value })
            }
            disabled={readOnly}
          />
        </div>
        {!readOnly && (
          <Button type="button" onClick={saveSettings} disabled={pending}>
            Save settings
          </Button>
        )}
      </section>

      {canChangePassword && (
        <section className="glass rounded-xl p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold">Change password</h2>
          <div className="space-y-2">
            <Label>Current password</Label>
            <Input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>New password</Label>
            <Input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm password</Label>
            <Input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
            />
          </div>
          <Button type="button" onClick={savePassword} disabled={pending}>
            Update password
          </Button>
        </section>
      )}
    </div>
  );
}
