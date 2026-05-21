import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2 font-heading text-lg font-bold tracking-tight",
        className
      )}
    >
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent transition-all duration-300 group-hover:border-accent/60 group-hover:shadow-glow-sm"
      >
        FS
      </span>
      <span className="gradient-heading">{SITE_NAME}</span>
    </Link>
  );
}
