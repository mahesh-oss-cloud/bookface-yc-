# Bookface

The private Y Combinator founder community — a searchable directory of every YC company and founder, a high-signal forum, the founder vault, and direct messaging.

**Live:** https://bookface-ycombinator.vercel.app

## What's inside

- **Company directory** — 6,377 YC companies with real logos, batch, one-liner, industry, location, team size, and status. Search and filter by batch or industry.
- **Founder directory** — 14,111 YC founders with real profile photos. Search by name, company, role, batch, industry, or location.
- **Company profiles** — logo, batch, one-liner, metadata, founders, related companies from the same batch.
- **Founder profiles** — photo, role, company, batch, location, industries, colleagues, and a direct message action.
- **Messaging** — one-way direct messages to any founder, stored locally per browser.
- **Forum** — fundraising, product, GTM, hiring, legal, technical, and founder-life discussions with replies and upvotes.
- **Resources** — playbooks, exclusive deals, investor lists, and the talent network.
- **Search** — unified company + founder search across the whole network.

## Data

Company and founder records are fetched from YC's public directory index by `scripts/fetch-yc-data.mjs` and `scripts/fetch-founders-all.mjs`, then stored as static JSON in `src/data/`. The secured index caps each query at 1,000 hits, so the fetcher partitions queries by batch and numeric ID range to retrieve the full set.

Blackbird Finance (W27) and its four founders are seeded manually in `src/lib/data.ts`, using details and the brand mark from blackbirdfinance.net.

Refresh the data with:

```bash
node scripts/fetch-yc-data.mjs
node scripts/fetch-founders-all.mjs
```

## Stack

- Next.js 16 (App Router, webpack)
- React 19 + TypeScript
- Tailwind CSS v4
- lucide-react icons
- sonner toasts

## Local development

```bash
npm install
npm run dev
```

Runs on http://localhost:3000.

```bash
npm run build
npm start
```

## Deployment

The project deploys to Vercel with `vercel.json` pinning the Next.js framework and `next build --webpack`. Data JSON files are included in server bundles via `outputFileTracingIncludes` in `next.config.ts`.

