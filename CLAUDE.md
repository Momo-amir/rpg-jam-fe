@AGENTS.md

# RPG Jam — Frontend

A D&D/TTRPG platform for character building, party management, session scheduling, and at-table digital helpers. Frontend consumes a C# ASP.NET Core Web API (separate repo). This file is the source of truth for how we build the frontend.

---

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 + React 19 | App Router only. Breaking changes from v15 — read docs in `node_modules/next/dist/docs/` before touching routing or data patterns |
| Language | TypeScript (strict) | |
| Styling | Tailwind v4 | Tailwind v4 uses `@tailwindcss/postcss`, not the old plugin. No `tailwind.config.js` |
| Component primitives | Base UI (`@base-ui/react`) | Headless, accessible, React 19 native primitives. We build our own styled components on top. Not Radix UI |
| Auth | Better Auth | Session DB: PostgreSQL (Docker). Calls C# JWT endpoint on login, stores token in encrypted server-side cookie |
| Forms | React Hook Form + Zod | RHF for controlled wizard forms. Zod schemas in `src/types/` are the source of truth for both validation and TypeScript types (`z.infer<>`) |
| Data fetching | Server Components + TanStack Query | Server Components for initial loads; TanStack Query for client-side mutations and real-time-ish state |
| API client | Axios instance in `src/utils/api/client.ts` | Configured with base URL and auth token interceptor. Domain files (`characters.ts` etc.) export typed functions on top |
| Testing | Vitest + React Testing Library + Playwright | Vitest over Jest — better ESM + Vite compatibility with Next.js 16 |
| Icons | Lucide React | |

---

## Architecture

The App Router handles routing. Everything else lives in a flat conventional structure: pages are thin and assembled from reusable components, all non-component logic lives in `utils/`, and domain logic stays out of UI.

```
proxy.ts                        # Route protection (Next.js 16 replacement for middleware.ts)
src/
├── app/                        # Next.js App Router — routing only, no business logic
│   ├── (marketing)/            # Public pages (landing)
│   │   └── page.tsx
│   ├── (auth)/                 # Auth pages — no app shell
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/                  # Authenticated shell (shared nav/layout)
│   │   ├── layout.tsx          # Auth check via auth.api.getSession() — primary auth gate
│   │   ├── dashboard/page.tsx
│   │   ├── characters/
│   │   │   ├── new/page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   ├── [id]/edit/page.tsx
│   │   │   └── [id]/print/page.tsx   # standalone — no shell, @media print
│   │   └── account/page.tsx
│   ├── (dm)/                   # DM role-gated area (nice-to-have)
│   │   └── layout.tsx
│   └── api/                    # Next.js route handlers (server-side, runs inside this app)
│       └── auth/[...all]/      # Better Auth handler — only route handler we need for now
│
├── components/                 # All React components
│   ├── ui/                     # Primitives — hand-built on top of Base UI
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── character/              # Character-domain components
│   │   ├── CharacterCard.tsx
│   │   ├── CharacterSheet.tsx
│   │   ├── StatBlock.tsx
│   │   └── wizard/             # Multi-step creation wizard
│   ├── layout/                 # Shell, nav, sidebar, page wrappers
│   └── shared/                 # Generic cross-domain components (EmptyState, etc.)
│
├── providers/                  # React context providers
│   ├── AuthProvider.tsx        # Better Auth session context
│   ├── QueryProvider.tsx       # TanStack Query client
│   └── ThemeProvider.tsx
│
├── hooks/                      # Custom hooks
│   ├── useCharacter.ts
│   ├── useSession.ts
│   └── ...
│
├── utils/                      # Non-component logic, one file per utility
│   ├── api/                    # Axios instance + domain API modules
│   │   ├── client.ts           # Axios instance with base URL + auth interceptor
│   │   ├── characters.ts       # getCharacter(), createCharacter(), etc.
│   │   └── ...
│   ├── types/                  # Zod schemas — source of truth for types AND validation
│   │   ├── character.ts        # characterSchema + `type Character = z.infer<...>`
│   │   └── ...
│   └── cn.ts                   # cn() class merging helper (and other named utility files)
│
└── types/                      # All types — Zod schemas for domain models, plain TS for the rest
    ├── character.ts            # characterSchema + inferred Character type
    ├── user.ts                 # userSchema + inferred User type
    └── api.ts                  # Non-schema types: ApiResponse<T>, PaginatedResponse<T>, etc.
```

---

## Key Conventions

### Server vs Client Components
- Default to **Server Components**. Only add `"use client"` when you need interactivity (state, effects, event handlers).
- Wizard steps are Client Components. The wizard wrapper page can be a Server Component that passes initial data down.
- Never fetch data in Client Components directly — pass data from Server Components or use TanStack Query for client-side refreshes.

### Auth
- Better Auth runs server-side. On login, it calls the C# `/api/auth/login` endpoint, receives the JWT, and stores it in an encrypted `HttpOnly` cookie.
- `proxy.ts` at the project root handles early redirects (unauthenticated → `/login`). The exported function must be named `proxy` — `middleware` is deprecated in Next.js 16. Runtime is Node.js only; Edge is not supported in `proxy.ts`.
- **`proxy.ts` is a first line of defence, not the auth gate.** Always re-verify the session inside layouts and Server Actions — never rely on proxy alone.
- Server Components call `auth.api.getSession()` to read the session. Client Components use `useSession()` from `better-auth/react`.
- All API calls attach `Authorization: Bearer <token>` via the shared API client — the raw JWT never touches client-side storage.

### API Client
- All backend calls go through `src/utils/api/client.ts` — an Axios instance configured with the base URL and an interceptor that attaches `Authorization: Bearer <token>`.
- Domain modules (e.g. `src/utils/api/characters.ts`) use the client and parse responses through Zod schemas. Pages and components import those functions, not the client directly.
- API base URL via `NEXT_PUBLIC_API_URL` env var. Never hardcode.

### Types
- All types live in `src/types/`. For anything that comes from the API, write a Zod schema and export the TypeScript type from it with `export type Character = z.infer<typeof characterSchema>`. No hand-written interfaces for API shapes.
- The same schema is used for form validation (RHF Zod resolver), API response parsing (Axios + `.parse()`), and anywhere else that shape is needed.

### Forms
- Use React Hook Form + Zod resolver everywhere.
- Server Actions are fine for simple mutations. For multi-step wizards (character creation), use RHF client-side and submit on the final step.

### Code Style
- No comments on straightforward code. Only add a comment when the why is non-obvious: a workaround, a constraint from outside the codebase, or something that would genuinely surprise a reader.
- No abbreviated variable names. Write `characterId` not `cid`, `userId` not `uid`, `event` not `e`, `error` not `err`. The name should tell you what it holds without needing context.

### Print Route
- `/characters/[id]/print` is a standalone page with no app shell, no nav.
- Only `@media print` CSS — no JavaScript dependencies that would break print layout.

### Styling
- Tailwind v4 utility-first. No custom CSS unless unavoidable (print styles are the exception).
- UI primitives live in `src/components/ui/` and are built by hand on top of Base UI (`@base-ui/react`). Use `cva` for variants and `cn()` for class merging.
- Dark mode supported from the start (DnD aesthetic lends itself to dark themes). Theme is toggled via `data-theme="dark"` on the root element — never use the `.dark` class.

---

## Pages & Routes

| URL | Purpose | Auth required |
|---|---|---|
| `/` | Landing / marketing | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/dashboard` | Character list | Yes |
| `/characters/new` | Creation wizard | Yes |
| `/characters/[id]` | Character sheet | Yes |
| `/characters/[id]/edit` | Edit form | Yes |
| `/characters/[id]/print` | Print-friendly sheet | Yes |
| `/account` | Profile & settings | Yes |
| `/dm` | DM dashboard | Yes + DM role |

---

## Environment Variables

```
NEXT_PUBLIC_API_URL=        # C# backend base URL
BETTER_AUTH_SECRET=         # Better Auth encryption secret
BETTER_AUTH_URL=            # Full URL of this app
```

---

## Testing

- **Unit**: Vitest + React Testing Library for components and hooks
- **E2E**: Playwright for key flows
  - "Register → create character → print sheet"
  - "Login → level up → view changes"
- Test files colocate next to the thing they test (`__tests__/` subfolder or `.test.tsx` sibling)
- No mocking the API in E2E — tests run against a real dev backend (Docker Compose)

---

## Nice-to-Haves (tackle after MVP)

- DM/Admin panel with role-based access
- Party system + invite codes
- Initiative tracker (combat view)
- Session log notes
- "Table mode" — big-font modifier helper for at-table use
- Calendar / session scheduling
- Offline support
- Spell slots + tracking
- Conditions tracker
- Multi-classing

---

## What NOT to Do

- Do not create `middleware.ts` — it is deprecated in Next.js 16, use `proxy.ts` with an exported `proxy` function
- Do not rely solely on `proxy.ts` for auth — always verify the session in layouts and Server Actions too
- Do not compute D&D stats or modifiers on the frontend — that is the backend's job
- Do not use the Pages Router — App Router only
- Do not use `next/legacy/image` — use `next/image`
- Do not fetch in `useEffect` — use Server Components or TanStack Query
- Do not put secrets in `NEXT_PUBLIC_*` env vars
- Do not use CSS Modules or styled-components — Tailwind only
- Do not use `any` in TypeScript without a comment explaining why
- Do not write standalone TypeScript interfaces for API shapes — define a Zod schema in `src/types/` and use `z.infer<>` for the type
