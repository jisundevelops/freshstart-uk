import type { SimGuideRow } from "@/types/tools";

export const SIM_TOOL_SLUG = "sim-comparison";

export interface SimConfig {
  slug: string;
  name: string;
  affiliateSlug: string;
  planType: string;
  monthlyCost: string;
  dataAllowance: string;
  internationalCalls: boolean;
  unlimitedData: boolean;
  eSimSupport: boolean;
  cheapest: boolean;
}

export const SIM_CONFIGS: SimConfig[] = [
  {
    slug: "giffgaff",
    name: "giffgaff",
    affiliateSlug: "giffgaff",
    planType: "PAYG / rolling",
    monthlyCost: "From £6",
    dataAllowance: "Flexible goodybags",
    internationalCalls: false,
    unlimitedData: false,
    eSimSupport: true,
    cheapest: true,
  },
  {
    slug: "lebara",
    name: "Lebara",
    affiliateSlug: "lebara-international",
    planType: "PAYG",
    monthlyCost: "From £5",
    dataAllowance: "UK + international mins",
    internationalCalls: true,
    unlimitedData: false,
    eSimSupport: true,
    cheapest: true,
  },
  {
    slug: "lyca",
    name: "Lyca Mobile",
    affiliateSlug: "lyca-mobile",
    planType: "PAYG / bundles",
    monthlyCost: "From £5",
    dataAllowance: "UK data + IDD bundles",
    internationalCalls: true,
    unlimitedData: false,
    eSimSupport: true,
    cheapest: true,
  },
  {
    slug: "ee",
    name: "EE",
    affiliateSlug: "ee-student",
    planType: "Pay monthly",
    monthlyCost: "From £18",
    dataAllowance: "Unlimited UK data plans",
    internationalCalls: true,
    unlimitedData: true,
    eSimSupport: true,
    cheapest: false,
  },
  {
    slug: "three",
    name: "Three",
    affiliateSlug: "three-payg",
    planType: "PAYG / contract",
    monthlyCost: "From £10",
    dataAllowance: "Large data allowances",
    internationalCalls: false,
    unlimitedData: true,
    eSimSupport: true,
    cheapest: false,
  },
  {
    slug: "voxi",
    name: "VOXI",
    affiliateSlug: "voxi",
    planType: "Rolling monthly",
    monthlyCost: "From £10",
    dataAllowance: "Unlimited social + data",
    internationalCalls: false,
    unlimitedData: true,
    eSimSupport: true,
    cheapest: false,
  },
];

export function mergeSimRows(
  affiliates: { slug: string; url: string; name: string }[],
  configs: SimConfig[] = SIM_CONFIGS
): SimGuideRow[] {
  const affiliateMap = new Map(affiliates.map((a) => [a.slug, a]));

  const fallbackUrls: Record<string, string> = {
    lyca: "https://www.lycamobile.co.uk/",
    voxi: "https://www.voxi.co.uk/",
  };

  return configs.map((sim) => {
    const affiliate = affiliateMap.get(sim.affiliateSlug);
    return {
      id: sim.slug,
      slug: sim.slug,
      name: sim.name,
      planType: sim.planType,
      monthlyCost: sim.monthlyCost,
      dataAllowance: sim.dataAllowance,
      internationalCalls: sim.internationalCalls,
      unlimitedData: sim.unlimitedData,
      eSimSupport: sim.eSimSupport,
      cheapest: sim.cheapest,
      affiliateUrl: affiliate?.url ?? fallbackUrls[sim.slug] ?? "#",
      affiliateSlug: sim.affiliateSlug,
    };
  });
}

export const SIM_GUIDE_FAQ = [
  {
    question: "Should I get a UK SIM before or after arrival?",
    answer:
      "Order a free PAYG SIM online before you fly, or buy one at the airport. Activate with ID when you land.",
  },
  {
    question: "Which network is best for international calls?",
    answer:
      "Lebara and Lyca specialise in low-cost calls abroad. EE offers strong UK coverage with roaming add-ons.",
  },
  {
    question: "Do UK student SIMs support eSIM?",
    answer:
      "Most major providers now offer eSIM. Check the eSIM column and confirm your phone is unlocked.",
  },
];
