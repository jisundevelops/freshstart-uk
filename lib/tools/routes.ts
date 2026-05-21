export const TOOL_ROUTE_MAP: Record<string, string> = {
  "bank-comparison": "/tools/bank-compare",
  "bank-compare": "/tools/bank-compare",
  "sim-comparison": "/tools/sim-guide",
  "sim-guide": "/tools/sim-guide",
  "cost-calculator": "/tools/cost-calculator",
};

export function resolveToolHref(slug: string, fallbackHref: string): string {
  return TOOL_ROUTE_MAP[slug] ?? fallbackHref;
}
