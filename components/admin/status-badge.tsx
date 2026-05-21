import { Badge } from "@/components/ui/badge";
import type { PublishStatus } from "@prisma/client";

export function StatusBadge({ status }: { status: PublishStatus }) {
  const variant =
    status === "PUBLISHED"
      ? "default"
      : status === "DRAFT"
        ? "secondary"
        : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}
