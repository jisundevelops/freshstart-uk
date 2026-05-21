import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AffiliateCta } from "@/components/tools/affiliate-cta";
import { BoolBadge } from "@/components/tools/comparison/bool-badge";
import type { BankCompareRow, SimGuideRow } from "@/types/tools";

type Row = BankCompareRow | SimGuideRow;

function isBankRow(row: Row): row is BankCompareRow {
  return "monthlyFee" in row;
}

interface ComparisonCardsProps {
  rows: Row[];
  toolSlug: string;
  path: string;
}

export function ComparisonCards({
  rows,
  toolSlug,
  path,
}: ComparisonCardsProps) {
  if (rows.length === 0) {
    return (
      <p className="text-center text-muted-foreground" role="status">
        No providers match your filters.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {rows.map((row) => (
        <li key={row.id}>
          <Card className="h-full glow-accent-hover">
            <CardHeader>
              <CardTitle className="text-xl">{row.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {isBankRow(row) ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted">Monthly fee</span>
                    <span>{row.monthlyFee}</span>
                  </div>
                  <p className="text-muted-foreground">{row.studentOffer}</p>
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="h-4 w-4 fill-accent" aria-hidden />
                    {row.appRating.toFixed(1)} app rating
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <BoolBadge
                      value={row.noCreditHistory}
                      label="No credit history"
                    />
                    <BoolBadge value={row.noUkAddress} label="No UK address" />
                    <BoolBadge
                      value={row.instantOpening}
                      label="Instant opening"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted">Cost</span>
                    <span>{row.monthlyCost}</span>
                  </div>
                  <p className="text-muted-foreground">{row.dataAllowance}</p>
                  <div className="flex flex-wrap gap-2">
                    <BoolBadge
                      value={row.internationalCalls}
                      label="International calls"
                    />
                    <BoolBadge
                      value={row.unlimitedData}
                      label="Unlimited data"
                    />
                    <BoolBadge value={row.eSimSupport} label="eSIM" />
                  </div>
                </>
              )}
              <AffiliateCta
                href={row.affiliateUrl}
                affiliateSlug={row.affiliateSlug}
                providerName={row.name}
                toolSlug={toolSlug}
                path={path}
                className="w-full"
                label={isBankRow(row) ? "Open account" : "Get SIM"}
              />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
