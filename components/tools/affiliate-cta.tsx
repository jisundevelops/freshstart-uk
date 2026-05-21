"use client";

import { useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { trackAffiliateClick } from "@/actions/tools-analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AffiliateCtaProps {
  href: string;
  affiliateSlug: string;
  providerName: string;
  toolSlug: string;
  path: string;
  label?: string;
  className?: string;
  size?: "default" | "sm";
}

export function AffiliateCta({
  href,
  affiliateSlug,
  providerName,
  toolSlug,
  path,
  label = "Visit provider",
  className,
  size = "sm",
}: AffiliateCtaProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await trackAffiliateClick({
        path,
        affiliateSlug,
        providerName,
        toolSlug,
      });
    });
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <Button
      type="button"
      variant="default"
      size={size}
      className={cn("glow-accent-hover", className)}
      disabled={pending}
      onClick={handleClick}
      aria-label={`${label} — ${providerName} (opens in new tab)`}
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </Button>
  );
}
