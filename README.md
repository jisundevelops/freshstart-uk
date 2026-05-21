# FreshStart UK

Production-ready foundation for a guide and resource platform helping international students settle in the United Kingdom.

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui patterns
- **Motion:** Framer Motion
- **Database:** PostgreSQL + Prisma ORM
- **Cache:** Upstash Redis
- **Deploy:** Vercel (LHR region)

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted)
- [Upstash Redis](https://upstash.com/) account (optional for local dev)

### Installation

```bash
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and Upstash credentials
```

### Database

```bash
npm run db:push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

## Project structure

```
freshstart-uk/
├── app/                 # App Router pages & global styles
├── components/
│   ├── layout/          # Navigation, footer
│   └── ui/              # shadcn-style primitives
├── hooks/               # Custom React hooks (Phase 2+)
├── lib/                 # Utilities, Prisma, Redis, fonts
├── prisma/              # Database schema
├── public/              # Static assets
├── types/               # Shared TypeScript types
├── middleware.ts        # Edge middleware & security headers
└── vercel.json          # Vercel deployment config
```

## Design system

| Token        | Value     |
| ------------ | --------- |
| Primary      | `#04080F` |
| Surface      | `#0A1628` |
| Accent       | `#00D4FF` |
| Accent 2     | `#7B61FF` |
| Accent 3     | `#00FF9D` |
| Text         | `#E8EDF5` |
| Muted        | `#6B7FA3` |

- **Headings:** Syne
- **Body:** DM Sans
- **Effects:** Glass morphism, grid overlays, radial glows, gradient headings

## Phase 1 scope

Foundation only — layout shell, theme, navigation, footer, Prisma/Redis helpers, and reusable UI primitives.

## Phase 2 — Database, auth & backend

### Database models

`Guide`, `BlogPost`, `AffiliateLink`, `Page`, `Tool`, `Admin`, `Analytics` (+ NextAuth `User`, `Account`, `Session`)

### Setup (Neon + Upstash)

```bash
cp .env.example .env
# Set DATABASE_URL (Neon), NEXTAUTH_SECRET, NEXTAUTH_URL, Upstash credentials

npm run db:migrate
npm run db:seed
```

Default seed admin: `admin@freshstart.uk` / `ChangeMe123!` (override with `ADMIN_SEED_PASSWORD`).

### API routes (`/api/v1`)

| Method | Path | Auth |
|--------|------|------|
| GET | `/health` | Public |
| GET | `/guides` | Public |
| GET | `/affiliates` | Public |
| POST | `/analytics` | Public (rate limited) |
| GET | `/admin/analytics` | Admin |

### Admin

- Login: `/admin/login`
- Dashboard: `/admin` (protected)

### Scripts

```bash
npm run db:migrate      # deploy migrations (production)
npm run db:migrate:dev  # dev migrations
npm run db:seed         # seed banks, SIMs, guides, blog posts
```

## Phase 3 — Public website

### Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage (hero, stats, guides, tools, testimonials, blog, newsletter) |
| `/guides` | Guide index with search + category filters |
| `/guides/[slug]` | Guide detail (ISR, 1h) |
| `/blog` | Blog index with tag filters |
| `/blog/[slug]` | Blog post (ISR, 1h) |
| `/scholarships` | Scholarship directory + FAQ schema |

### SEO

- Dynamic metadata, canonical URLs, OpenGraph, Twitter cards
- `app/sitemap.xml`, `app/robots.txt`
- JSON-LD: WebSite, BreadcrumbList, Article, FAQPage
- Dynamic OG images (`/opengraph-image`, per guide/post)

### Run locally

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Set `DATABASE_URL` (Neon) and optional Upstash vars in `.env` for live content and caching.

## Phase 4 — Interactive tools

| Tool | Route |
|------|--------|
| Bank comparison | `/tools/bank-compare` |
| SIM guide | `/tools/sim-guide` |
| Cost of living calculator | `/tools/cost-calculator` |
| Tools index | `/tools` |

- Comparison data merged from `lib/tools/*` configs + `AffiliateLink` records (Redis-cached)
- Affiliate clicks tracked via `actions/tools-analytics.ts` (`LINK_CLICK`, `TOOL_USE`)
- URL search params for filters, sort, and view mode; calculator state is shareable via query string
- Re-run `npm run db:seed` to register tool routes in the `Tool` table

## Environment variables

See [.env.example](.env.example).

## License

Private — all rights reserved.
