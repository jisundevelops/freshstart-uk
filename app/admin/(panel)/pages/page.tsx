import { getCmsSections } from "@/actions/admin/pages";
import { CmsSectionsForm } from "@/components/admin/cms-sections-form";
import { getAdminContext } from "@/lib/admin/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Page Editor" };

export default async function AdminPagesPage() {
  const { canWrite } = await getAdminContext();
  const result = await getCmsSections();
  if (!result.success) {
    return <p className="text-muted-foreground">Failed to load sections.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="gradient-heading font-heading text-3xl font-bold">
        Site sections
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Edit homepage hero, stats, footer, and affiliate disclosure. Changes
        autosave every few seconds.
      </p>
      <CmsSectionsForm
        homepage={result.data.homepage}
        footer={result.data.footer}
        disclosure={result.data.disclosure}
        readOnly={!canWrite}
      />
    </div>
  );
}
