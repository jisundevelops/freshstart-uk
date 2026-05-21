import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function BoolBadge({ value, label }: { value: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        value
          ? "bg-accent-tertiary/15 text-accent-tertiary"
          : "bg-muted/20 text-muted"
      )}
      title={label}
    >
      {value ? (
        <Check className="h-3 w-3" aria-hidden />
      ) : (
        <X className="h-3 w-3" aria-hidden />
      )}
      <span className="sr-only">{label}: </span>
      {value ? "Yes" : "No"}
    </span>
  );
}
