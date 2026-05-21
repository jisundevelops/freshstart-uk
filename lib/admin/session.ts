import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canWrite, canManageSettings } from "@/lib/admin/permissions";
import { redirect } from "next/navigation";

export async function getAdminContext() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/login");
  }
  return {
    session,
    canWrite: canWrite(session.user.role),
    canManageSettings: canManageSettings(session.user.role),
  };
}
