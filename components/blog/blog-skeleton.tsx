import { Skeleton } from "@/components/ui/skeleton";

export function BlogGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-56 w-full rounded-lg" />
      ))}
    </div>
  );
}
