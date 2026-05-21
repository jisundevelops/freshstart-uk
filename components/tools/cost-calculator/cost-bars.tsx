"use client";

import { motion } from "framer-motion";
import type { CostBreakdown } from "@/types/tools";

const LABELS: { key: keyof CostBreakdown; label: string; color: string }[] = [
  { key: "rent", label: "Rent", color: "bg-accent" },
  { key: "food", label: "Food", color: "bg-accent-secondary" },
  { key: "transport", label: "Transport", color: "bg-accent-tertiary" },
  { key: "bills", label: "Bills", color: "bg-accent/60" },
  { key: "miscellaneous", label: "Other", color: "bg-muted" },
];

interface CostBarsProps {
  breakdown: CostBreakdown;
  maxTotal?: number;
}

export function CostBars({ breakdown, maxTotal }: CostBarsProps) {
  const max = maxTotal ?? breakdown.total;

  return (
    <ul className="space-y-4" aria-label="Monthly cost breakdown">
      {LABELS.map((item, index) => {
        const value = breakdown[item.key];
        if (typeof value !== "number") return null;
        const pct = max > 0 ? (value / max) * 100 : 0;

        return (
          <li key={item.key}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-foreground">
                £{value.toLocaleString("en-GB")}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-surface/80">
              <motion.div
                className={`h-full rounded-full ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                role="presentation"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
