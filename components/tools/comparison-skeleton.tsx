import { Skeleton } from "@/components/ui/skeleton";

export function ComparisonSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
