# Fusion Starter

A production-ready Next.js 15 application template tailored for building a SaaS pricing page builder. The stack combines the Next.js App Router, React 18, TypeScript, TailwindCSS, Radix UI, and modern tooling so you can focus on pricing experiences instead of project plumbing.

Only add API routes when logic must execute on the server (e.g. secrets, database operations). Keep everything else in the client for maximum responsiveness.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 18 + TypeScript
- **Styling**: TailwindCSS 3 with design tokens defined in `app/globals.css`
- **UI**: Radix UI + shadcn/ui components + Lucide icons
- **Data**: TanStack Query for client-side data orchestration
- **Testing**: Vitest

## Project Structure

```
app/                      # Next.js App Router entrypoints
├── page.tsx              # Pricing builder experience
├── layout.tsx            # Root layout + providers
├── not-found.tsx         # 404 route
└── api/                  # Route handlers (e.g. /api/ping)

components/               # Reusable UI and feature components
contexts/                 # React context providers (client components)
hooks/                    # Custom React hooks
lib/                      # Shared utilities
services/                 # Client-side service helpers
shared/                   # Types shared with API routes
```

## Routing

Next.js App Router drives navigation:

- `app/page.tsx` renders the pricing builder preview with all configured plans.
- Additional routes live inside `app/` (e.g. `app/(marketing)/about/page.tsx`).
- 404s render through `app/not-found.tsx`.

### API Routes

Use route handlers under `app/api/*/route.ts` for any server-side logic. Responses are typed with the modules in `shared/`.

```typescript
// app/api/demo/route.ts
import { NextResponse } from "next/server";
import { DemoResponse } from "@shared/api";

export function GET() {
  const response: DemoResponse = { message: "Hello from Next.js API route" };
  return NextResponse.json(response);
}
```

Call the route from the client with standard `fetch`:

```typescript
const res = await fetch("/api/demo");
const data: DemoResponse = await res.json();
```

## Styling System

- **TailwindCSS** powers utility styling.
- **Tokens** live in `app/globals.css`; update custom colors or radius values there and in `tailwind.config.ts`.
- **UI Components** sit under `components/ui/` and expose the shadcn-style API.
- `cn()` from `@/lib/utils` merges class names safely.

```typescript
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className // user overrides
)}
```

## Shared Types

Use the aliases configured in `tsconfig.json`:

- `@/*` resolves to the repository root (app, components, lib, etc.)
- `@shared/*` resolves to `shared/`

## Development Commands

```bash
pnpm dev        # Start Next.js dev server (hot reload)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm lint       # ESLint with Next rules
pnpm test       # Run Vitest tests
```

## Adding Features

### Extend the Theme

1. Update CSS variables in `app/globals.css`.
2. Add matching entries to `tailwind.config.ts`.

### New API Route

1. Optionally create a shared type in `shared/api.ts`.
2. Add a handler under `app/api/<route>/route.ts` exporting the HTTP methods you need.
3. Consume via `fetch` on the client or `fetch`/`cookies` on the server.

### Additional Pages

1. Create a directory such as `app/pricing/page.tsx`.
2. Export a component (`export default function Pricing() { ... }`).

## Deployment Notes

- **Standard**: `pnpm build` then `pnpm start`.
- **Netlify**: Uses `@netlify/plugin-nextjs` via `netlify.toml`.
- **Vercel**: Deploy directly with `vercel`, no extra config needed.

## Architecture Highlights

- Next.js App Router with React 18 client components for interactive pricing tooling.
- TypeScript end-to-end with shared contracts in `shared/`.
- Tailwind-powered styling plus Radix UI primitives.
- TanStack Query for data fetching/caching when backend endpoints are added.
