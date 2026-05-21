import { Container } from "@/components/ui/container";
import { ComparisonSkeleton } from "@/components/tools/comparison-skeleton";

export default function BankCompareLoading() {
  return (
    <section className="py-10 md:py-14" aria-busy="true" aria-label="Loading bank comparison">
      <Container>
        <div className="mb-8 max-w-3xl">
          <div className="h-4 w-40 rounded bg-accent/10 mb-4" aria-hidden />
          <div className="h-8 w-64 rounded bg-accent/10" aria-hidden />
          <div className="mt-4 h-5 w-96 rounded bg-accent/10" aria-hidden />
        </div>
        <ComparisonSkeleton />
      </Container>
    </section>
  );
}
