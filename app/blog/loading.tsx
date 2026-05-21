import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <section className="py-12 md:py-16" aria-busy="true" aria-label="Loading blog">
      <Container>
        <div className="mb-10 max-w-2xl">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="mt-4 h-6 w-80" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-5">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="mt-4 h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-1/2" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
