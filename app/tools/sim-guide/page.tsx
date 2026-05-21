import { Suspense } from "react";
import Link from "next/link";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { SimGuideExplorer } from "@/components/tools/sim-guide-explorer";
import { ToolPageTracker } from "@/components/tools/tool-page-tracker";
import { ComparisonSkeleton } from "@/components/tools/comparison-skeleton";
import { buildPageMetadata } from "@/lib/seo";
import { SIM_GUIDE_FAQ, SIM_TOOL_SLUG } from "@/lib/tools/sim-guide";
import { fetchSimGuideRows } from "@/lib/tools/fetch";

const PATH = "/tools/sim-guide";

export const metadata = buildPageMetadata({
  title: "UK SIM Comparison for International Students",
  description:
    "Compare giffgaff, Lebara, Lyca, EE, Three, and VOXI — international calls, unlimited data, eSIM, and PAYG plans.",
  path: PATH,
});

export const revalidate = 3600;

export default async function SimGuidePage() {
  const rows = await fetchSimGuideRows();

  return (
    <ToolPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "SIM guide" },
      ]}
      title="UK SIM & mobile comparison"
      description="Find the right PAYG or contract SIM for your first weeks in the UK. Filter by international calls, unlimited data, eSIM, and price."
      faq={SIM_GUIDE_FAQ}
    >
      <ToolPageTracker toolSlug={SIM_TOOL_SLUG} path={PATH} />
      <p className="mb-6 text-sm text-muted">
        Step-by-step help in our{" "}
        <Link href="/guides/get-uk-sim-card" className="text-accent hover:underline">
          SIM card guide
        </Link>
        .
      </p>
      <Suspense fallback={<ComparisonSkeleton />}>
        <SimGuideExplorer rows={rows} path={PATH} />
      </Suspense>
    </ToolPageLayout>
  );
}
