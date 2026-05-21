export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  eligibility: string;
  deadline: string;
  href: string;
  featured?: boolean;
}

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "chevening",
    name: "Chevening Scholarships",
    provider: "UK Government (FCDO)",
    amount: "Full funding (tuition, living, flights)",
    eligibility:
      "Outstanding leadership potential; 2+ years work experience; citizens of Chevening-eligible countries.",
    deadline: "November (annual cycle)",
    href: "https://www.chevening.org/",
    featured: true,
  },
  {
    id: "commonwealth-shared",
    name: "Commonwealth Shared Scholarships",
    provider: "Commonwealth Scholarship Commission",
    amount: "Full tuition + living allowance",
    eligibility:
      "Citizens of eligible Commonwealth countries; for taught master's programmes at participating UK universities.",
    deadline: "December – March",
    href: "https://cscuk.fcdo.gov.uk/",
    featured: true,
  },
  {
    id: "gates-cambridge",
    name: "Gates Cambridge Scholarship",
    provider: "Bill & Melinda Gates Foundation",
    amount: "Full cost of study at Cambridge",
    eligibility:
      "Outstanding applicants to postgraduate degrees at the University of Cambridge from outside the UK.",
    deadline: "October – December (course-dependent)",
    href: "https://www.gatescambridge.org/",
    featured: true,
  },
  {
    id: "british-council-great",
    name: "GREAT Scholarships",
    provider: "British Council + UK universities",
    amount: "£10,000+ tuition reduction",
    eligibility:
      "Students from selected countries applying for postgraduate study at participating institutions.",
    deadline: "Varies by university",
    href: "https://www.britishcouncil.org/study-uk/scholarships/great-scholarships",
    featured: false,
  },
  {
    id: "university-specific",
    name: "University International Excellence Awards",
    provider: "Individual UK universities",
    amount: "£2,000 – £8,000",
    eligibility:
      "Merit-based awards for international undergraduates and postgraduates; criteria vary by institution.",
    deadline: "Rolling / course start dates",
    href: "https://www.ucas.com/",
    featured: false,
  },
];

export const SCHOLARSHIP_FAQ = [
  {
    question: "When should I apply for UK scholarships?",
    answer:
      "Most major scholarships open 12–18 months before your course starts. Chevening and Commonwealth schemes typically close in autumn/winter for the following academic year.",
  },
  {
    question: "Can I combine scholarships with a Student visa?",
    answer:
      "Yes, if the scholarship meets your course and living costs requirements on your CAS. Always confirm funding details with your university's international office.",
  },
  {
    question: "Do I need an offer before applying?",
    answer:
      "Many university-specific awards require an offer or application ID. Chevening and Commonwealth programmes have their own timelines — check each scheme's website.",
  },
  {
    question: "Are scholarships taxable in the UK?",
    answer:
      "Scholarship tax treatment depends on your circumstances. HMRC guidance applies; universities often provide a funding letter for visa purposes.",
  },
];
