export type BankCompareRow = {
  id: string;
  slug: string;
  name: string;
  monthlyFee: string;
  studentOffer: string;
  appRating: number;
  documentsNeeded: string;
  openTime: string;
  noCreditHistory: boolean;
  noUkAddress: boolean;
  instantOpening: boolean;
  affiliateUrl: string;
  affiliateSlug: string;
};

export type SimGuideRow = {
  id: string;
  slug: string;
  name: string;
  planType: string;
  monthlyCost: string;
  dataAllowance: string;
  internationalCalls: boolean;
  unlimitedData: boolean;
  eSimSupport: boolean;
  cheapest: boolean;
  affiliateUrl: string;
  affiliateSlug: string;
};

export type CostCityId =
  | "london"
  | "manchester"
  | "birmingham"
  | "edinburgh"
  | "leeds";

export type RentType = "shared" | "private" | "studio";
export type EatingHabits = "budget" | "moderate" | "social";
export type TransportUsage = "minimal" | "regular" | "heavy";
export type EntertainmentLevel = "low" | "medium" | "high";

export interface CostCalculatorInput {
  city: CostCityId;
  rent: RentType;
  eating: EatingHabits;
  transport: TransportUsage;
  entertainment: EntertainmentLevel;
}

export interface CostBreakdown {
  rent: number;
  food: number;
  transport: number;
  bills: number;
  miscellaneous: number;
  total: number;
}

export type ComparisonSortDir = "asc" | "desc";
