import Link from "next/link";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { CostCalculatorTool } from "@/components/tools/cost-calculator/cost-calculator-tool";
import { ToolPageTracker } from "@/components/tools/tool-page-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, softwareApplicationJsonLd } from "@/lib/seo";
import {
  COST_CALCULATOR_FAQ,
  COST_TOOL_SLUG,
  parseCalculatorSearchParams,
} from "@/lib/tools/cost-calculator";

const PATH = "/tools/cost-calculator";

export const metadata = buildPageMetadata({
  title: "UK Cost of Living Calculator",
  description:
    "Estimate monthly student living costs in London, Manchester, Birmingham, Edinburgh, and Leeds. Compare with Dhaka baseline.",
  path: PATH,
  keywords: ["UK cost of living", "student budget calculator", "living costs UK", "London student budget", "Manchester student costs"],
});

export const revalidate = 3600;

interface CostCalculatorPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function CostCalculatorPage({
  searchParams,
}: CostCalculatorPageProps) {
  const initial = parseCalculatorSearchParams(searchParams);

  return (
    <ToolPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Cost calculator" },
      ]}
      title="Cost of living calculator"
      description="Adjust rent, food, transport, and lifestyle to see a realistic monthly budget — plus a Dhaka comparison for context."
      faq={COST_CALCULATOR_FAQ}
    >
      <JsonLd
        data={softwareApplicationJsonLd({
          name: "UK Cost of Living Calculator",
          description: "Estimate monthly student living costs across UK cities. Compare with Dhaka baseline.",
          path: PATH,
          applicationCategory: "FinanceApplication",
        })}
      />
      <ToolPageTracker toolSlug={COST_TOOL_SLUG} path={PATH} />
      <p className="mb-6 text-sm text-muted">
        Read our{" "}
        <Link href="/guides" className="text-accent hover:underline">
          settling-in guides
        </Link>{" "}
        for more detailed budgeting advice.
      </p>
      <CostCalculatorTool initial={initial} path={PATH} />
    </ToolPageLayout>
  );
}
