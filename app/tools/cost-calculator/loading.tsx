import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CostCalculatorLoading() {
  return (
    <section className="py-10 md:py-14" aria-busy="true" aria-label="Loading cost calculator">
      <Container>
        <div className="mb-8 max-w-3xl">
          <div className="h-4 w-40 rounded bg-accent/10 mb-4" aria-hidden />
          <div className="h-8 w-64 rounded bg-accent/10" aria-hidden />
          <div className="mt-4 h-5 w-96 rounded bg-accent/10" aria-hidden />
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="glass rounded-xl p-6 md:p-8">
            <Skeleton className="h-6 w-32" />
            <div className="mt-6 space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-3 h-2 w-full rounded-full" />
                  <Skeleton className="mt-2 h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass-strong rounded-xl p-6 md:p-8">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="mt-2 h-12 w-40" />
              <Skeleton className="mt-4 h-4 w-60" />
              <div className="mt-8 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 flex-1 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
