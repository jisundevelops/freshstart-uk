import { notFound } from "next/navigation";
import { getAdminGuide } from "@/actions/admin/guides";
import { GuideForm } from "@/components/admin/guide-form";
import { getAdminContext } from "@/lib/admin/session";

export const metadata = { title: "Edit Guide" };

export default async function EditGuidePage({
  params,
}: {
  params: { id: string };
}) {
  const { canWrite } = await getAdminContext();
  const result = await getAdminGuide(params.id);
  if (!result.success) notFound();

  return (
    <GuideForm
      guide={result.data.guide}
      seo={result.data.seo}
      readOnly={!canWrite}
    />
  );
}
