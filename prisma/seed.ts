import {
  AdminRole,
  AffiliateCategory,
  AnalyticsEventType,
  PrismaClient,
  PublishStatus,
  ToolCategory,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const now = new Date();

async function main() {
  console.log("Seeding FreshStart UK database...");

  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123!",
    12
  );

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@freshstart.uk" },
    update: {},
    create: {
      email: "admin@freshstart.uk",
      name: "FreshStart Admin",
      admin: {
        create: {
          passwordHash,
          role: AdminRole.SUPER_ADMIN,
        },
      },
    },
    include: { admin: true },
  });

  console.log(`Admin user: ${adminUser.email}`);

  const banks = [
    {
      slug: "monzo-student",
      name: "Monzo",
      description:
        "Digital bank popular with students. No UK address required to open an account in many cases.",
      url: "https://monzo.com/",
      category: AffiliateCategory.BANK,
      featured: true,
      sortOrder: 1,
    },
    {
      slug: "barclays-student",
      name: "Barclays Student Additions",
      description:
        "High-street bank with dedicated international student account options.",
      url: "https://www.barclays.co.uk/current-accounts/student/",
      category: AffiliateCategory.BANK,
      featured: true,
      sortOrder: 2,
    },
    {
      slug: "hsbc-international",
      name: "HSBC International Student",
      description:
        "Global bank with UK branches — useful if you already bank with HSBC abroad.",
      url: "https://www.hsbc.co.uk/current-accounts/products/international-student/",
      category: AffiliateCategory.BANK,
      featured: false,
      sortOrder: 3,
    },
    {
      slug: "lloyds-student",
      name: "Lloyds Student Account",
      description:
        "Established UK bank with student overdraft options after eligibility checks.",
      url: "https://www.lloydsbank.com/current-accounts/student.html",
      category: AffiliateCategory.BANK,
      featured: false,
      sortOrder: 4,
    },
  ];

  const simProviders = [
    {
      slug: "giffgaff",
      name: "giffgaff",
      description:
        "Flexible PAYG and monthly plans. Easy to order a free SIM online.",
      url: "https://www.giffgaff.com/",
      category: AffiliateCategory.SIM,
      promoCode: null,
      featured: true,
      sortOrder: 1,
    },
    {
      slug: "ee-student",
      name: "EE",
      description:
        "Strong UK 5G coverage. Student deals available in-store and online.",
      url: "https://ee.co.uk/",
      category: AffiliateCategory.SIM,
      featured: true,
      sortOrder: 2,
    },
    {
      slug: "vodafone-student",
      name: "Vodafone",
      description:
        "Nationwide network with international roaming add-ons for trips home.",
      url: "https://www.vodafone.co.uk/",
      category: AffiliateCategory.SIM,
      featured: false,
      sortOrder: 3,
    },
    {
      slug: "three-payg",
      name: "Three",
      description:
        "Competitive data plans. Go Roam in selected destinations included on many plans.",
      url: "https://www.three.co.uk/",
      category: AffiliateCategory.SIM,
      featured: false,
      sortOrder: 4,
    },
    {
      slug: "lebara-international",
      name: "Lebara",
      description:
        "Low-cost international calls — popular for staying in touch with family abroad.",
      url: "https://www.lebara.co.uk/",
      category: AffiliateCategory.SIM,
      featured: false,
      sortOrder: 5,
    },
  ];

  for (const bank of banks) {
    await prisma.affiliateLink.upsert({
      where: { slug: bank.slug },
      update: bank,
      create: { ...bank, status: PublishStatus.PUBLISHED },
    });
  }

  for (const sim of simProviders) {
    await prisma.affiliateLink.upsert({
      where: { slug: sim.slug },
      update: sim,
      create: { ...sim, status: PublishStatus.PUBLISHED },
    });
  }

  const guides = [
    {
      slug: "open-uk-bank-account",
      title: "How to Open a UK Bank Account as an International Student",
      excerpt:
        "Step-by-step guide to choosing a bank, required documents, and timeline expectations.",
      category: "banking",
      featured: true,
      sortOrder: 1,
      content: `## What you need

- Valid passport
- BRP or share code (immigration status)
- Proof of UK address (tenancy agreement or university letter)
- Student status letter from your university

## Recommended timeline

Apply within your first two weeks in the UK. Many banks let you start online, but you may need an in-branch appointment for photo ID verification.

## Tips

- Compare Monzo, Barclays, and HSBC first — they are the most student-friendly.
- Avoid expensive international transfer fees by setting up a UK account early.
- Ask your university international office for a bank introduction letter.`,
    },
    {
      slug: "get-uk-sim-card",
      title: "Getting a UK SIM Card: PAYG vs Contract",
      excerpt:
        "Compare PAYG, monthly rolling, and contract plans so you can stay connected from day one.",
      category: "mobile",
      featured: true,
      sortOrder: 2,
      content: `## PAYG vs contract

**PAYG (Pay As You Go)** — Best for the first month while you compare networks. giffgaff and Lebara are popular.

**Rolling monthly** — No long contract; cancel anytime. Good balance of price and flexibility.

**12-month contract** — Cheapest per GB if you are staying a full academic year.

## Activation

1. Order a free SIM online or buy one at Tesco, Sainsbury's, or the airport.
2. Activate with passport ID if required.
3. Port your home number later if needed (not urgent).`,
    },
    {
      slug: "national-insurance-number",
      title: "National Insurance Number for Students",
      excerpt:
        "When you need an NI number, how to apply, and what to do while you wait.",
      category: "work",
      featured: false,
      sortOrder: 3,
      content: `## Do you need one?

You only need a National Insurance (NI) number if you plan to work part-time in the UK.

## How to apply

Apply online via GOV.UK after you arrive. You will need your passport and BRP details.

## While waiting

You can start work in many cases before the number arrives — give your employer your application reference.`,
    },
    {
      slug: "register-with-gp",
      title: "Registering with a GP (NHS Doctor)",
      excerpt:
        "Find your nearest GP surgery and register for NHS primary care as a student.",
      category: "health",
      featured: false,
      sortOrder: 4,
      content: `## Why register early

International students on visas longer than six months generally pay the Immigration Health Surcharge and can use the NHS.

## Steps

1. Find surgeries near your term-time address on the NHS website.
2. Complete the registration form (online or paper).
3. Bring ID and proof of address.

## Emergency care

For emergencies call **999**. For urgent non-emergency advice call **111**.`,
    },
  ];

  for (const guide of guides) {
    await prisma.guide.upsert({
      where: { slug: guide.slug },
      update: {
        ...guide,
        status: PublishStatus.PUBLISHED,
        publishedAt: now,
      },
      create: {
        ...guide,
        status: PublishStatus.PUBLISHED,
        publishedAt: now,
      },
    });
  }

  const blogPosts = [
    {
      slug: "first-week-in-uk-checklist",
      title: "Your First Week in the UK: A Practical Checklist",
      excerpt:
        "From airport arrival to SIM, bank, and university enrolment — everything in order.",
      tags: ["arrival", "checklist", "essentials"],
      featured: true,
      content: `Landing in the UK is exciting and overwhelming. Prioritise these in your first seven days:

1. **Collect BRP** (if not digital-only) or confirm eVisa access
2. **Get a UK SIM** — even a cheap PAYG plan
3. **Open or start a bank application**
4. **Register with your university** and attend orientation
5. **Register with a GP** near your accommodation
6. **Set up Oyster or local travel card** if in London

FreshStart UK guides expand each step with links and provider comparisons.`,
    },
    {
      slug: "budgeting-london-vs-regions",
      title: "Student Budgeting: London vs Other UK Cities",
      excerpt:
        "Realistic monthly costs for rent, food, transport, and social life outside London.",
      tags: ["budget", "living-costs"],
      featured: true,
      content: `London rent can be double Manchester or Glasgow. A realistic monthly budget (excluding tuition):

| City | Rent (shared) | Food & essentials | Transport |
|------|---------------|-------------------|-----------|
| London | £700–£1,100 | £200–£280 | £90–£120 |
| Manchester | £450–£650 | £180–£240 | £60–£80 |
| Glasgow | £400– £600 | £170–£230 | £55–£75 |

Use student discounts (UNiDAYS, TOTUM) and cook at home three to four nights per week.`,
    },
    {
      slug: "part-time-work-visa-rules",
      title: "Part-Time Work on a Student Visa: What You Need to Know",
      excerpt:
        "Hours limits, term-time restrictions, and how to find compliant jobs.",
      tags: ["visa", "work"],
      featured: false,
      content: `Most Student visa holders can work up to **20 hours per week** during term time and full-time in holidays.

Always check your visa vignette and CAS letter. Your employer may ask for your NI number and right-to-work share code.

University career services are the safest place to find compliant roles.`,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        ...post,
        status: PublishStatus.PUBLISHED,
        publishedAt: now,
      },
      create: {
        ...post,
        status: PublishStatus.PUBLISHED,
        publishedAt: now,
      },
    });
  }

  await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      slug: "about",
      title: "About FreshStart UK",
      content:
        "FreshStart UK helps international students navigate banking, mobile, healthcare, and life admin in the United Kingdom.",
      metaTitle: "About Us | FreshStart UK",
      metaDesc: "Supporting international students settling in the UK.",
      status: PublishStatus.PUBLISHED,
      publishedAt: now,
    },
  });

  const tools = [
    {
      slug: "bank-comparison",
      name: "Bank Account Comparison",
      description: "Compare student-friendly UK bank accounts side by side.",
      href: "/tools/bank-compare",
      category: ToolCategory.BANKING,
      icon: "landmark",
      featured: true,
      sortOrder: 1,
    },
    {
      slug: "sim-comparison",
      name: "SIM & Mobile Comparison",
      description: "Find the best PAYG and contract plans for international students.",
      href: "/tools/sim-guide",
      category: ToolCategory.MOBILE,
      icon: "smartphone",
      featured: true,
      sortOrder: 2,
    },
    {
      slug: "cost-calculator",
      name: "Cost of Living Calculator",
      description:
        "Estimate monthly rent, food, transport, and lifestyle costs in UK cities.",
      href: "/tools/cost-calculator",
      category: ToolCategory.GENERAL,
      icon: "calculator",
      featured: true,
      sortOrder: 3,
    },
  ];

  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: tool,
      create: { ...tool, status: PublishStatus.PUBLISHED },
    });
  }

  await prisma.analytics.createMany({
    data: [
      {
        eventType: AnalyticsEventType.PAGE_VIEW,
        path: "/",
        sessionId: "seed-session-1",
        country: "GB",
      },
      {
        eventType: AnalyticsEventType.PAGE_VIEW,
        path: "/guides/open-uk-bank-account",
        sessionId: "seed-session-2",
        country: "IN",
      },
      {
        eventType: AnalyticsEventType.LINK_CLICK,
        path: "/affiliates/monzo-student",
        sessionId: "seed-session-2",
        metadata: { target: "monzo-student" },
      },
    ],
    skipDuplicates: true,
  });

  await prisma.siteConfig.upsert({
    where: { key: "seed_version" },
    update: { value: "phase2-v1" },
    create: { key: "seed_version", value: "phase2-v1" },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
