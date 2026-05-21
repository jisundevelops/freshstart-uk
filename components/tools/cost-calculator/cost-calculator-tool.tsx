"use client";

import { useMemo, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CostBars } from "@/components/tools/cost-calculator/cost-bars";
import {
  calculateCost,
  COST_CITIES,
  DHAKA_BASELINE,
  encodeCalculatorParams,
} from "@/lib/tools/cost-calculator";
import type { CostCalculatorInput } from "@/types/tools";
import { cn } from "@/lib/utils";

const RENT_OPTIONS = [
  { id: "shared", label: "Shared room" },
  { id: "private", label: "Private room" },
  { id: "studio", label: "Studio" },
] as const;

const EATING_OPTIONS = [
  { id: "budget", label: "Budget cooking" },
  { id: "moderate", label: "Mixed" },
  { id: "social", label: "Eating out often" },
] as const;

const TRANSPORT_OPTIONS = [
  { id: "minimal", label: "Walk / cycle" },
  { id: "regular", label: "Bus & metro" },
  { id: "heavy", label: "Heavy travel" },
] as const;

const ENTERTAINMENT_OPTIONS = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
] as const;

interface CostCalculatorToolProps {
  initial: CostCalculatorInput;
  path: string;
}

export function CostCalculatorTool({ initial, path }: CostCalculatorToolProps) {
  const router = useRouter();
  const [input, setInput] = useState<CostCalculatorInput>(initial);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const breakdown = useMemo(() => calculateCost(input), [input]);
  const dhaka = DHAKA_BASELINE;
  const maxCompare = Math.max(breakdown.total, dhaka.total);

  const updateInput = useCallback(
    (patch: Partial<CostCalculatorInput>) => {
      setInput((prev) => {
        const next = { ...prev, ...patch };
        startTransition(() => {
          const qs = encodeCalculatorParams(next);
          router.replace(`${path}?${qs}`, { scroll: false });
        });
        return next;
      });
    },
    [path, router]
  );

  async function handleShare() {
    const qs = encodeCalculatorParams(input);
    const url = `${window.location.origin}${path}?${qs}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied to clipboard");
    } catch {
      setShareMsg("Copy this URL: " + url);
    }
    setTimeout(() => setShareMsg(null), 3000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="glass rounded-xl p-6 md:p-8">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Your lifestyle
        </h2>

        <div className="mt-6 space-y-6">
          <fieldset>
            <legend className="text-sm font-medium text-muted-foreground">
              City
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {COST_CITIES.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => updateInput({ city: city.id })}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm transition-colors",
                    input.city === city.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border hover:border-accent/40"
                  )}
                  aria-pressed={input.city === city.id}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </fieldset>

          <SliderField
            label="Rent type"
            options={RENT_OPTIONS}
            value={input.rent}
            onChange={(rent) =>
              updateInput({ rent: rent as CostCalculatorInput["rent"] })
            }
          />
          <SliderField
            label="Eating habits"
            options={EATING_OPTIONS}
            value={input.eating}
            onChange={(eating) =>
              updateInput({ eating: eating as CostCalculatorInput["eating"] })
            }
          />
          <SliderField
            label="Transport"
            options={TRANSPORT_OPTIONS}
            value={input.transport}
            onChange={(transport) =>
              updateInput({
                transport: transport as CostCalculatorInput["transport"],
              })
            }
          />
          <SliderField
            label="Entertainment"
            options={ENTERTAINMENT_OPTIONS}
            value={input.entertainment}
            onChange={(entertainment) =>
              updateInput({
                entertainment:
                  entertainment as CostCalculatorInput["entertainment"],
              })
            }
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-strong rounded-xl p-6 md:p-8">
          <p className="text-sm uppercase tracking-wider text-muted">
            Estimated monthly total
          </p>
          <p className="mt-2 font-heading text-5xl font-bold text-accent">
            £{breakdown.total.toLocaleString("en-GB")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {COST_CITIES.find((c) => c.id === input.city)?.label} · indicative
            student budget
          </p>
          <div className="mt-8">
            <CostBars breakdown={breakdown} />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-6 w-full"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" aria-hidden />
            Save & share calculation
          </Button>
          {shareMsg && (
            <p className="mt-2 text-center text-xs text-accent" role="status">
              {shareMsg}
            </p>
          )}
        </div>

        <div className="glass rounded-xl p-6 md:p-8">
          <h3 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <Link2 className="h-5 w-5 text-accent" aria-hidden />
            Dhaka vs{" "}
            {COST_CITIES.find((c) => c.id === input.city)?.label ?? "UK"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Approximate monthly living comparison (GBP equivalent for context).
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Dhaka baseline
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                £{dhaka.total.toLocaleString("en-GB")}
              </p>
              <div className="mt-4">
                <CostBars breakdown={dhaka} maxTotal={maxCompare} />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Your UK estimate
              </p>
              <p className="mt-1 text-2xl font-bold text-accent">
                £{breakdown.total.toLocaleString("en-GB")}
              </p>
              <div className="mt-4">
                <CostBars breakdown={breakdown} maxTotal={maxCompare} />
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted">
            Difference: approximately £
            {(breakdown.total - dhaka.total).toLocaleString("en-GB")} more per
            month in the UK city selected.
          </p>
        </div>
      </div>
    </div>
  );
}

function SliderField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  const index = options.findIndex((o) => o.id === value);

  return (
    <div>
      <Label className="text-muted-foreground">{label}</Label>
      <input
        type="range"
        min={0}
        max={options.length - 1}
        value={index >= 0 ? index : 0}
        onChange={(e) => {
          const opt = options[Number(e.target.value)];
          if (opt) onChange(opt.id);
        }}
        className="mt-3 w-full accent-accent"
        aria-valuemin={0}
        aria-valuemax={options.length - 1}
        aria-valuenow={index}
        aria-valuetext={options[index]?.label ?? options[0]?.label ?? ""}
        aria-label={label}
      />
      <p className="mt-2 text-sm font-medium text-foreground">
        {options[index]?.label ?? options[0]?.label ?? ""}
      </p>
    </div>
  );
}
