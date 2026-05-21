import { GuideForm } from "@/components/admin/guide-form";
import { getAdminContext } from "@/lib/admin/session";
import { redirect } from "next/navigation";

export const metadata = { title: "New Guide" };

export default async function NewGuidePage() {
  const { canWrite } = await getAdminContext();
  if (!canWrite) redirect("/admin/guides");
  return <GuideForm />;
}
