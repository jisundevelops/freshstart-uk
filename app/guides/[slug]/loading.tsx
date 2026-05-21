import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function GuideLoading() {
  return (
    <div className="py-12 md:py-16" aria-busy="true" aria-label="Loading guide">
      <Container size="narrow">
        <Skeleton className="mb-6 h-4 w-48" />
        <Skeleton className="h-12 w-full max-w-2xl" />
        <Skeleton className="mt-4 h-6 w-full max-w-xl" />
        <div className="mt-10 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Container>
    </div>
  );
}
