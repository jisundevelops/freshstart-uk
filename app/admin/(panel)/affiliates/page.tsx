import { listAdminAffiliates, getAffiliateClickCounts } from "@/actions/admin/affiliates";
import { AffiliateManager } from "@/components/admin/affiliate-manager";
import { getAdminContext } from "@/lib/admin/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Affiliate Links" };

export default async function AdminAffiliatesPage() {
  const { canWrite } = await getAdminContext();
  const [affiliatesResult, clicksResult] = await Promise.all([
    listAdminAffiliates(),
    getAffiliateClickCounts(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="gradient-heading font-heading text-3xl font-bold">
        Affiliate links
      </h1>
      <AffiliateManager
        affiliates={affiliatesResult.success ? affiliatesResult.data : []}
        clickCounts={clicksResult.success ? clicksResult.data : []}
        readOnly={!canWrite}
      />
    </div>
  );
}
