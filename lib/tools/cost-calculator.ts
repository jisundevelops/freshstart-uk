import type {
  CostBreakdown,
  CostCalculatorInput,
  CostCityId,
  EntertainmentLevel,
  EatingHabits,
  RentType,
  TransportUsage,
} from "@/types/tools";

export const COST_TOOL_SLUG = "cost-calculator";

export const COST_CITIES: {
  id: CostCityId;
  label: string;
  rentMultiplier: number;
}[] = [
  { id: "london", label: "London", rentMultiplier: 1.45 },
  { id: "manchester", label: "Manchester", rentMultiplier: 0.85 },
  { id: "birmingham", label: "Birmingham", rentMultiplier: 0.8 },
  { id: "edinburgh", label: "Edinburgh", rentMultiplier: 0.9 },
  { id: "leeds", label: "Leeds", rentMultiplier: 0.75 },
];

const BASE_RENT: Record<RentType, number> = {
  shared: 550,
  private: 750,
  studio: 950,
};

const EATING_MULT: Record<EatingHabits, number> = {
  budget: 0.75,
  moderate: 1,
  social: 1.35,
};

const TRANSPORT_COST: Record<TransportUsage, number> = {
  minimal: 45,
  regular: 90,
  heavy: 140,
};

const ENTERTAINMENT_COST: Record<EntertainmentLevel, number> = {
  low: 40,
  medium: 90,
  high: 160,
};

/** Dhaka baseline (BDT converted approx. to GBP for comparison display) */
export const DHAKA_BASELINE: CostBreakdown = {
  rent: 180,
  food: 120,
  transport: 25,
  bills: 35,
  miscellaneous: 50,
  total: 410,
};

export function calculateCost(input: CostCalculatorInput): CostBreakdown {
  const city = COST_CITIES.find((c) => c.id === input.city);
  const rentMult = city?.rentMultiplier ?? 1;

  const rent = Math.round(BASE_RENT[input.rent] * rentMult);
  const food = Math.round(220 * EATING_MULT[input.eating] * (0.9 + rentMult * 0.1));
  const transport = Math.round(TRANSPORT_COST[input.transport] * (input.city === "london" ? 1.25 : 1));
  const bills = Math.round(85 * (0.85 + rentMult * 0.15));
  const miscellaneous = Math.round(ENTERTAINMENT_COST[input.entertainment]);

  const total = rent + food + transport + bills + miscellaneous;

  return { rent, food, transport, bills, miscellaneous, total };
}

export function parseCalculatorSearchParams(
  params: Record<string, string | string[] | undefined>
): CostCalculatorInput {
  const get = (key: string, fallback: string) => {
    const v = params[key];
    return typeof v === "string" ? v : fallback;
  };

  const city = get("city", "manchester") as CostCityId;
  const validCities = COST_CITIES.map((c) => c.id);
  const rent = get("rent", "shared") as RentType;
  const eating = get("eating", "moderate") as EatingHabits;
  const transport = get("transport", "regular") as TransportUsage;
  const entertainment = get("entertainment", "medium") as EntertainmentLevel;

  return {
    city: validCities.includes(city) ? city : "manchester",
    rent: ["shared", "private", "studio"].includes(rent) ? rent : "shared",
    eating: ["budget", "moderate", "social"].includes(eating)
      ? eating
      : "moderate",
    transport: ["minimal", "regular", "heavy"].includes(transport)
      ? transport
      : "regular",
    entertainment: ["low", "medium", "high"].includes(entertainment)
      ? entertainment
      : "medium",
  };
}

export function encodeCalculatorParams(input: CostCalculatorInput): string {
  const sp = new URLSearchParams({
    city: input.city,
    rent: input.rent,
    eating: input.eating,
    transport: input.transport,
    entertainment: input.entertainment,
  });
  return sp.toString();
}

export const COST_CALCULATOR_FAQ = [
  {
    question: "How accurate is this cost of living estimate?",
    answer:
      "Figures are indicative averages for international students based on public rent and living cost surveys. Your actual spend depends on lifestyle and area.",
  },
  {
    question: "Why compare with Dhaka?",
    answer:
      "Many students arrive from Bangladesh; the Dhaka baseline helps frame UK costs in a familiar context before you budget in pounds.",
  },
  {
    question: "Does this include tuition fees?",
    answer:
      "No — this calculator covers monthly living costs only (rent, food, transport, bills, and social spend).",
  },
];
