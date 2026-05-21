import { Star } from "lucide-react";
import { AffiliateCta } from "@/components/tools/affiliate-cta";
import { BoolBadge } from "@/components/tools/comparison/bool-badge";
import type { BankCompareRow } from "@/types/tools";
import type { SimGuideRow } from "@/types/tools";

type Row = BankCompareRow | SimGuideRow;

function isBankRow(row: Row): row is BankCompareRow {
  return "monthlyFee" in row && "appRating" in row;
}

interface ComparisonTableProps {
  rows: Row[];
  toolSlug: string;
  path: string;
}

export function ComparisonTable({
  rows,
  toolSlug,
  path,
}: ComparisonTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-center text-muted-foreground" role="status">
        No providers match your filters.
      </p>
    );
  }

  const first = rows[0];
  if (first && isBankRow(first)) {
    const bankRows = rows as BankCompareRow[];
    return (
      <div className="overflow-x-auto rounded-lg border border-border/60 glass">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="sticky top-[8.5rem] z-30 bg-surface/95 backdrop-blur-md">
            <tr className="border-b border-border/60">
              <th scope="col" className="p-4 font-heading font-semibold">
                Bank
              </th>
              <th scope="col" className="p-4">
                Monthly fee
              </th>
              <th scope="col" className="p-4">
                Student offer
              </th>
              <th scope="col" className="p-4">
                App rating
              </th>
              <th scope="col" className="p-4">
                Documents
              </th>
              <th scope="col" className="p-4">
                Open time
              </th>
              <th scope="col" className="p-4">
                No credit history
              </th>
              <th scope="col" className="p-4">
                No UK address
              </th>
              <th scope="col" className="p-4">
                Instant open
              </th>
              <th scope="col" className="p-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {bankRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/40 transition-colors hover:bg-surface/30"
              >
                <th scope="row" className="p-4 font-medium text-foreground">
                  {row.name}
                </th>
                <td className="p-4 text-muted-foreground">{row.monthlyFee}</td>
                <td className="max-w-[200px] p-4 text-muted-foreground">
                  {row.studentOffer}
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-accent">
                    <Star className="h-3.5 w-3.5 fill-accent" aria-hidden />
                    {row.appRating.toFixed(1)}
                  </span>
                </td>
                <td className="max-w-[180px] p-4 text-muted-foreground">
                  {row.documentsNeeded}
                </td>
                <td className="p-4 text-muted-foreground">{row.openTime}</td>
                <td className="p-4">
                  <BoolBadge value={row.noCreditHistory} label="No credit history" />
                </td>
                <td className="p-4">
                  <BoolBadge value={row.noUkAddress} label="No UK address" />
                </td>
                <td className="p-4">
                  <BoolBadge value={row.instantOpening} label="Instant opening" />
                </td>
                <td className="p-4">
                  <AffiliateCta
                    href={row.affiliateUrl}
                    affiliateSlug={row.affiliateSlug}
                    providerName={row.name}
                    toolSlug={toolSlug}
                    path={path}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const simRows = rows as SimGuideRow[];
  return (
    <div className="overflow-x-auto rounded-lg border border-border/60 glass">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm">
        <thead className="sticky top-[8.5rem] z-30 bg-surface/95 backdrop-blur-md">
          <tr className="border-b border-border/60">
            <th scope="col" className="p-4 font-heading font-semibold">
              Provider
            </th>
            <th scope="col" className="p-4">
              Plan type
            </th>
            <th scope="col" className="p-4">
              Monthly cost
            </th>
            <th scope="col" className="p-4">
              Data
            </th>
            <th scope="col" className="p-4">
              Intl. calls
            </th>
            <th scope="col" className="p-4">
              Unlimited data
            </th>
            <th scope="col" className="p-4">
              eSIM
            </th>
            <th scope="col" className="p-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {simRows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border/40 transition-colors hover:bg-surface/30"
            >
              <th scope="row" className="p-4 font-medium text-foreground">
                {row.name}
              </th>
              <td className="p-4 text-muted-foreground">{row.planType}</td>
              <td className="p-4 text-muted-foreground">{row.monthlyCost}</td>
              <td className="p-4 text-muted-foreground">{row.dataAllowance}</td>
              <td className="p-4">
                <BoolBadge
                  value={row.internationalCalls}
                  label="International calls"
                />
              </td>
              <td className="p-4">
                <BoolBadge value={row.unlimitedData} label="Unlimited data" />
              </td>
              <td className="p-4">
                <BoolBadge value={row.eSimSupport} label="eSIM support" />
              </td>
              <td className="p-4">
                <AffiliateCta
                  href={row.affiliateUrl}
                  affiliateSlug={row.affiliateSlug}
                  providerName={row.name}
                  toolSlug={toolSlug}
                  path={path}
                  label="Get SIM"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
