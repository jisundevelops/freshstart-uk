export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  university: string;
  country: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "FreshStart's bank account guide saved me hours. I walked into Monzo with every document ready on day three.",
    name: "Priya Sharma",
    university: "University of Manchester",
    country: "India",
  },
  {
    id: "2",
    quote:
      "The SIM comparison page helped me pick giffgaff before lectures started. No shock bills, just data.",
    name: "James Okafor",
    university: "King's College London",
    country: "Nigeria",
  },
  {
    id: "3",
    quote:
      "Registering with a GP felt impossible until I found the step-by-step NHS guide here. Done in one afternoon.",
    name: "Lin Wei",
    university: "University of Edinburgh",
    country: "China",
  },
  {
    id: "4",
    quote:
      "As a master's student on a tight budget, the living-cost breakdown for London vs Manchester was spot on.",
    name: "Sofia Mendez",
    university: "UCL",
    country: "Mexico",
  },
];
