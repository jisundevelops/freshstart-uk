import type { BankCompareRow } from "@/types/tools";

export const BANK_TOOL_SLUG = "bank-comparison";

export interface BankConfig {
  slug: string;
  name: string;
  affiliateSlug: string;
  monthlyFee: string;
  studentOffer: string;
  appRating: number;
  documentsNeeded: string;
  openTime: string;
  noCreditHistory: boolean;
  noUkAddress: boolean;
  instantOpening: boolean;
}

export const BANK_CONFIGS: BankConfig[] = [
  {
    slug: "barclays",
    name: "Barclays",
    affiliateSlug: "barclays-student",
    monthlyFee: "£0",
    studentOffer: "Student Additions — free overdraft eligibility",
    appRating: 4.2,
    documentsNeeded: "Passport, BRP, proof of address, student letter",
    openTime: "1–2 weeks",
    noCreditHistory: true,
    noUkAddress: false,
    instantOpening: false,
  },
  {
    slug: "hsbc",
    name: "HSBC",
    affiliateSlug: "hsbc-international",
    monthlyFee: "£0",
    studentOffer: "International Student Account",
    appRating: 4.0,
    documentsNeeded: "Passport, visa/BRP, university letter",
    openTime: "1–2 weeks",
    noCreditHistory: true,
    noUkAddress: false,
    instantOpening: false,
  },
  {
    slug: "monzo",
    name: "Monzo",
    affiliateSlug: "monzo-student",
    monthlyFee: "£0",
    studentOffer: "Full UK current account via app",
    appRating: 4.6,
    documentsNeeded: "Passport, selfie ID, UK address (flexible)",
    openTime: "Minutes–48 hours",
    noCreditHistory: true,
    noUkAddress: true,
    instantOpening: true,
  },
  {
    slug: "starling",
    name: "Starling",
    affiliateSlug: "starling-student",
    monthlyFee: "£0",
    studentOffer: "Personal account with budgeting tools",
    appRating: 4.5,
    documentsNeeded: "Passport, BRP or share code",
    openTime: "Same day (app)",
    noCreditHistory: true,
    noUkAddress: true,
    instantOpening: true,
  },
  {
    slug: "wise",
    name: "Wise",
    affiliateSlug: "wise-account",
    monthlyFee: "£0",
    studentOffer: "Multi-currency account (not a full UK bank)",
    appRating: 4.7,
    documentsNeeded: "Passport, proof of identity",
    openTime: "Same day",
    noCreditHistory: true,
    noUkAddress: true,
    instantOpening: true,
  },
];

export function mergeBankRows(
  affiliates: {
    slug: string;
    url: string;
    name: string;
  }[],
  configs: BankConfig[] = BANK_CONFIGS
): BankCompareRow[] {
  const affiliateMap = new Map(affiliates.map((a) => [a.slug, a]));

  return configs.map((bank) => {
    const affiliate = affiliateMap.get(bank.affiliateSlug);
    const fallbackUrl =
      bank.slug === "starling"
        ? "https://www.starlingbank.com/"
        : bank.slug === "wise"
          ? "https://wise.com/"
          : "#";

    return {
      id: bank.slug,
      slug: bank.slug,
      name: bank.name,
      monthlyFee: bank.monthlyFee,
      studentOffer: bank.studentOffer,
      appRating: bank.appRating,
      documentsNeeded: bank.documentsNeeded,
      openTime: bank.openTime,
      noCreditHistory: bank.noCreditHistory,
      noUkAddress: bank.noUkAddress,
      instantOpening: bank.instantOpening,
      affiliateUrl: affiliate?.url ?? fallbackUrl,
      affiliateSlug: bank.affiliateSlug,
    };
  });
}

export const BANK_COMPARE_FAQ = [
  {
    question: "Which UK bank is best for international students?",
    answer:
      "Monzo and Starling are popular for fast app-based opening. Barclays and HSBC suit students who prefer branch support. Compare fees, address requirements, and overdraft options above.",
  },
  {
    question: "Can I open a UK bank account without a UK address?",
    answer:
      "Some digital banks allow a university letter or temporary address. Check the 'No UK address' column for each provider.",
  },
  {
    question: "Do I need UK credit history?",
    answer:
      "Student accounts typically do not require UK credit history. All banks listed here support new arrivals.",
  },
];
