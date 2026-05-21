"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canWrite, canManageSettings } from "@/lib/admin/permissions";
import { AuthError } from "@/lib/errors";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new AuthError("Unauthorized");
  }
  return session;
}

export async function requireWriteAccess() {
  const session = await requireAdminSession();
  if (!canWrite(session.user.role)) {
    throw new AuthError("You do not have permission to edit content");
  }
  return session;
}

export async function requireSettingsAccess() {
  const session = await requireAdminSession();
  if (!canManageSettings(session.user.role)) {
    throw new AuthError("Only super admins can change settings");
  }
  return session;
}
