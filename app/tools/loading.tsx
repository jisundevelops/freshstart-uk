import { Container } from "@/components/ui/container";
import { ComparisonSkeleton } from "@/components/tools/comparison-skeleton";

export default function ToolsLoading() {
  return (
    <section className="py-10 md:py-14" aria-busy="true" aria-label="Loading tool">
      <Container>
        <ComparisonSkeleton />
      </Container>
    </section>
  );
}
