# Bookface

A private founder-network interface with a searchable YC company and founder directory, discussions, resources, and direct messaging.

**Live:** https://bookface-yc.vercel.app

## What's inside

- **Company directory** — searchable company records with YC batch, one-liner, industry, location, team size, status, and public website where listed.
- **Founder directory** — searchable founder records with photo, current company, role, batch, industry, and location where listed.
- **Company profiles** — structured public directory details, company summary, linked founders, same-batch companies, and the corresponding public YC profile.
- **Founder profiles** — role, company, batch, location, industry, linked colleagues, and public YC profile where a public slug is available.
- **Sign-in** — private, email-allowlisted access with a server-side password hash and signed, HTTP-only session cookie. There is no public sign-up.
- **Messaging** — direct messages in the current client implementation are stored locally per browser.
- **Forum and resources** — founder discussions, playbooks, investor lists, and talent resources.

The sign-in on this deployment is specific to this Bookface instance. It is not YC single sign-on, does not use a YC password, and does not independently verify YC founder or alumni status. YC verification is a separate process.

## Data

Company and founder records are fetched from YC's public directory index by the scripts in the scripts directory, then stored as static JSON in src/data. Public records may have incomplete fields. Profile pages use only available public directory metadata for fallback summaries; they do not invent biographies or company claims.

Blackbird Finance (W27) and its four founders are seeded manually in src/lib/data.ts.

Refresh the public directory data by running:
node scripts/fetch-yc-data.mjs
node scripts/fetch-founders-all.mjs

## Environment variables

Copy .env.example to .env.local for local development and configure these server-only values:

- BOOKFACE_LOGIN_EMAIL — the single email address allowed to sign in.
- BOOKFACE_LOGIN_PASSWORD_HASH — PBKDF2-SHA512 hash formatted as pbkdf2$iterations$saltHex$hashHex. Do not place a plaintext password here.
- BOOKFACE_SESSION_SECRET — a long, random secret used to sign session cookies.

In production, configure the values in Vercel Project Settings → Environment Variables. Never commit .env.local or plaintext credentials. The login cookie is HTTP-only, SameSite=Lax, secure in production, and expires after 12 hours.

## Stack

- Next.js 16 (App Router, webpack)
- React 19 + TypeScript
- Tailwind CSS v4
- lucide-react icons
- sonner toasts

## Local development

Run npm install, then npm run dev. The app runs on http://localhost:3000.

Run npm run build and npm start to test the production build locally.

## Deployment

The project deploys to Vercel with vercel.json pinning the Next.js framework and next build --webpack. Data JSON files are included in server bundles via outputFileTracingIncludes in next.config.ts.
