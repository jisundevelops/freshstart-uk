import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminContext } from "@/lib/admin/session";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getAdminContext();
  return <AdminShell>{children}</AdminShell>;
}
