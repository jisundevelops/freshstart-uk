"use client";

import { useEffect, useRef } from "react";
import { trackToolUse } from "@/actions/tools-analytics";

export function ToolPageTracker({
  toolSlug,
  path,
}: {
  toolSlug: string;
  path: string;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackToolUse(toolSlug, path).catch(() => {
      // Silently fail — tracking is non-critical
    });
  }, [toolSlug, path]);

  return null;
}
