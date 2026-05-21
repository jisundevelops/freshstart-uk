import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScholarshipsLoading() {
  return (
    <section className="py-12 md:py-16" aria-busy="true" aria-label="Loading scholarships">
      <Container>
        <div className="mb-10 max-w-2xl">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-4 h-6 w-80" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-5">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
              <Skeleton className="mt-4 h-9 w-28" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
