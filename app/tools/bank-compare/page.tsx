import { Suspense } from "react";
import Link from "next/link";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { BankCompareExplorer } from "@/components/tools/bank-compare-explorer";
import { ToolPageTracker } from "@/components/tools/tool-page-tracker";
import { ComparisonSkeleton } from "@/components/tools/comparison-skeleton";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, softwareApplicationJsonLd } from "@/lib/seo";
import {
  BANK_COMPARE_FAQ,
  BANK_TOOL_SLUG,
} from "@/lib/tools/bank-compare";
import { fetchBankCompareRows } from "@/lib/tools/fetch";

const PATH = "/tools/bank-compare";

export const metadata = buildPageMetadata({
  title: "UK Student Bank Account Comparison",
  description:
    "Compare Barclays, HSBC, Monzo, Starling, and Wise for international students — fees, documents, app ratings, and instant opening.",
  path: PATH,
  keywords: ["UK bank comparison", "student bank account", "international student banking", "Monzo", "Starling", "Wise"],
});

export const revalidate = 3600;

export default async function BankComparePage() {
  const rows = await fetchBankCompareRows();

  return (
    <ToolPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Bank comparison" },
      ]}
      title="UK student bank account comparison"
      description="Filter and sort student-friendly banks. See fees, documents, and which accounts work without UK credit history or a permanent address."
      faq={BANK_COMPARE_FAQ}
    >
      <JsonLd
        data={softwareApplicationJsonLd({
          name: "UK Student Bank Account Comparison",
          description: "Compare student-friendly UK banks — fees, documents, app ratings, and instant opening.",
          path: PATH,
          applicationCategory: "FinanceApplication",
        })}
      />
      <ToolPageTracker toolSlug={BANK_TOOL_SLUG} path={PATH} />
      <p className="mb-6 text-sm text-muted">
        Also read our{" "}
        <Link href="/guides/open-uk-bank-account" className="text-accent hover:underline">
          bank account opening guide
        </Link>
        .
      </p>
      <Suspense fallback={<ComparisonSkeleton />}>
        <BankCompareExplorer rows={rows} path={PATH} />
      </Suspense>
    </ToolPageLayout>
  );
}
