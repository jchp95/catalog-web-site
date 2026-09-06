# LOCAL/SHOWROOM V2

A modern interactive sales showroom for demonstrating high-end websites to local-business prospects.

## What is live in V2

- **Showroom** — cinematic catalog, interactive live deck, project pipeline and commercial narrative.
- **MIREYA** — beauty salon concept with live service selection, stylist/time booking and simulated confirmation.
- **APEX DETAIL LAB** — automotive detailing concept with vehicle/package/add-on configuration, reactive estimate and before/after comparator.
- BLACKLINE, CASA FUEGO, HARBOR and BRIGHTLINE remain visible in the V2 roadmap and will be migrated next.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript (strict)
- Tailwind CSS 4 (CSS-first tokens)
- Motion for React
- Feature-oriented folder structure

## Requirements

- Node.js 20.9+ (Node 22 LTS recommended)
- npm 10+

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

If port 3000 is already used:

```bash
npm run dev -- -p 3001
```

## Production build

```bash
npm run build
npm start
```

## Routes

- `/` — LOCAL/SHOWROOM
- `/demos/mireya` — MIREYA
- `/demos/apex` — APEX DETAIL LAB

## Demo safety

All conversions are simulated in-browser. No appointment, quote, payment or lead is sent to a backend in this stage.

## Architecture principle

Shared infrastructure stays small and generic. Industry-specific experiences remain feature-owned. A vertical can evolve or be replaced without coupling its business interaction to another demo.

Read `docs/ARCHITECTURE.md` and `docs/DESIGN_DIRECTION.md` before adding another vertical.
