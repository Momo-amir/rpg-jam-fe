@AGENTS.md

# RPG Jam — Frontend

A D&D/TTRPG platform for character building, party management, session scheduling, and at-table digital helpers. Frontend consumes a C# ASP.NET Core Web API (separate repo). This file is the source of truth for how we build the frontend.

---

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 + React 19 | App Router only. Breaking changes from v15 — read docs in `node_modules/next/dist/docs/` before touching routing or data patterns |
| Language | TypeScript (strict) | |
| Styling | Tailwind v4 | Uses `@tailwindcss/postcss`, not the old plugin. No `tailwind.config.js` |
| Component primitives | Base UI (`@base-ui/react`) | Headless, accessible, React 19 native primitives. We build our own styled components on top. Not Radix UI |
| Auth | No auth library | C# ASP.NET Core Identity owns users, passwords, roles, and the OAuth dance. `jose` decodes the JWT locally — no network call on route changes. Zustand holds the decoded user on the client |
| Auth store | Zustand | Holds decoded user payload only — never the token. Token stays in the HttpOnly cookie |
| Forms | React Hook Form + Zod | RHF for all forms. Zod schemas in `src/types/` are the source of truth for both validation and TypeScript types |
| Data fetching | Server Components + Axios | Server Components for initial loads; direct Axios calls for client-side mutations |
| API client | Axios instance in `src/utils/api/client.ts` | `withCredentials: true` — sends HttpOnly cookie automatically. 401 interceptor handles token refresh |
| Testing | Vitest + React Testing Library + Playwright | Vitest over Jest — better ESM + Vite compatibility with Next.js 16 |
| Icons | Lucide React | |

---

## Architecture

```
proxy.ts                        # jose.jwtVerify() on cookie — redirects to /login if missing or invalid
src/
├── app/                        # Next.js App Router — routing only, no business logic
│   ├── (marketing)/            # Public pages (landing)
│   │   └── page.tsx
│   ├── (auth)/                 # Auth pages — no app shell, no nav
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/                  # Authenticated shell — shared nav and layout
│   │   ├── layout.tsx          # Calls verifySession() — decodes JWT, passes User down as prop
│   │   ├── dashboard/page.tsx
│   │   ├── characters/
│   │   │   ├── new/page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   ├── [id]/edit/page.tsx
│   │   │   └── [id]/print/page.tsx   # standalone — no shell, @media print only
│   │   └── account/page.tsx
│   └── (dm)/                   # DM role-gated area (post-MVP)
│       └── layout.tsx          # verifySession() + role check
│
├── components/
│   ├── ui/                     # Primitives built on top of Base UI
│   ├── character/              # Character-domain components
│   ├── layout/                 # Shell, nav, sidebar, page wrappers
│   └── shared/                 # Generic cross-domain components (EmptyState, etc.)
│
├── lib/                        # Server-only infrastructure — never imported by Client Components
│   ├── session.ts              # getSession(): reads cookie, jose.jwtVerify(), returns User | null. Wrapped with cache()
│   └── dal.ts                  # verifySession(): wraps getSession(), redirects to /login on null
│
├── store/
│   └── auth.ts                 # Zustand store — holds decoded User payload, never the token
│
├── providers/
│   ├── QueryProvider.tsx       # (deprecated — do not use)
│   └── ThemeProvider.tsx
│
├── hooks/
│   └── useSession.ts           # Reads from Zustand auth store — no network call
│
├── utils/
│   ├── api/
│   │   ├── client.ts           # Axios instance — withCredentials: true + 401 refresh interceptor
│   │   ├── auth.ts             # login(), register(), logout() — call C# endpoints, update Zustand store
│   │   ├── characters.ts       # getCharacter(), createCharacter(), etc.
│   │   └── ...
│   └── cn.ts                   # cn() class merging helper
│
└── types/
    ├── user.ts                 # userSchema + User type
    ├── auth.ts                 # loginSchema, registerSchema + inferred form types
    └── api.ts                  # ApiResponse<T>, PaginatedResponse<T>
```

---

## Auth

This is the most important section. Read it before touching anything auth-related.

### Who owns what

**C# owns everything auth** — user records, password hashing, roles, OAuth, JWT signing, and token expiry. The frontend makes no auth decisions and stores no credentials.

**Next.js owns three things only:**
- Decoding and verifying the JWT C# issues (locally, via `jose` — no network call)
- Redirecting unauthenticated or unauthorised users
- Holding the decoded user in Zustand so client components can read it without a network call

### How a login works

1. User submits the login form
2. `login()` in `src/utils/api/auth.ts` calls `POST /api/auth/login` on C#
3. C# validates credentials and sets two `HttpOnly; Secure; SameSite=Lax` cookies: a short-lived access token (15–60 min) and a long-lived refresh token (7–30 days). The JWT never touches JavaScript
4. `login()` decodes the access token payload with `jose` and writes `{ id, email, name, roles }` into the Zustand auth store
5. Browser stores both cookies automatically. Axios sends them on every subsequent request via `withCredentials: true`
6. On the next page load, `proxy.ts` calls `jose.jwtVerify()` on the access token cookie — no network call, instant
7. The `(app)` layout calls `verifySession()`, decodes the JWT, and passes the User down as a prop to all child pages

### How token refresh works

1. Access token expires. Next API call returns 401
2. Axios interceptor catches the 401, calls `POST /api/auth/refresh` once
3. C# validates the refresh token cookie, issues a new access token cookie
4. Axios retries the original request with the new cookie
5. If refresh also fails (refresh token expired/revoked) → clear Zustand store, redirect to `/login`

### How OAuth works

OAuth is entirely C#'s responsibility. The frontend does one thing: navigate the browser to the C# initiation URL. C# handles the provider redirect, callback, token exchange, user upsert, and sets both cookies. Then redirects back to `/dashboard`.

```tsx
// This is the entire OAuth implementation on the frontend
<a href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/github`}>
  Continue with GitHub
</a>
```

### The auth layers

| Layer | File | What it does | On failure |
|---|---|---|---|
| Proxy | `proxy.ts` | `jose.jwtVerify()` on cookie | Redirect `/login` |
| Layout gate | `(app)/layout.tsx` | `verifySession()` — decode + pass User as prop | Redirect `/login` |
| DAL | `src/lib/dal.ts` | `verifySession()` in Server Actions and data fetches | Redirect `/login` |
| API client | `src/utils/api/client.ts` | 401 interceptor — refresh or redirect | Redirect `/login` |
| C# | `[Authorize]` attributes | Real enforcement — signature, expiry, roles | 401 / 403 |

C# is the only real security boundary. Everything in Next.js is UX — fast redirects and clean state management.

### The session files

**`src/lib/session.ts`** — server-only. Reads the access token cookie, calls `jose.jwtVerify()` with `JWT_SECRET`, returns `User | null`. Wrapped with React `cache()` so multiple calls in one render cost one decode, not many.

**`src/lib/dal.ts`** — server-only. `verifySession()` calls `getSession()` and redirects to `/login` if null. Always call this — never `getSession()` directly.

**`src/store/auth.ts`** — Zustand store. Holds `{ user: User | null }`. Set after login, cleared on logout or 401. Never holds the token — only the decoded payload.

**`src/hooks/useSession.ts`** — reads from the Zustand store. Returns `{ user, isLoading: false }` immediately — no network call, no async.

### C# contract

| Method | Path | What it does |
|---|---|---|
| `POST` | `/api/auth/login` | Validate credentials, set access + refresh token cookies, return `{ user }` |
| `POST` | `/api/auth/register` | Create user, set cookies, return `{ user }` |
| `POST` | `/api/auth/refresh` | Validate refresh token cookie, issue new access token cookie |
| `POST` | `/api/auth/logout` | Clear both cookies |
| `GET` | `/api/auth/github` | Initiate GitHub OAuth — full flow owned by C# |
| `GET` | `/api/auth/google` | Initiate Google OAuth — full flow owned by C# |

`GET /api/auth/me` exists but is only called for sensitive operations — never for normal session reads.

---

## Key Conventions

### Server vs Client Components
- Default to Server Components. Add `"use client"` only when you need interactivity.
- Never fetch data in Client Components directly — pass it from Server Components as props, or call Axios functions in event handlers (auth flow pattern).
- All files in `src/lib/` must have `import 'server-only'` at the top. Build error if accidentally imported client-side.

### API Client
- All C# calls go through `src/utils/api/client.ts` — Axios with `withCredentials: true`.
- No `Authorization: Bearer` header, no token in JS. The HttpOnly cookie is sent automatically by the browser.
- The 401 interceptor is the only place that handles token refresh. Do not handle 401s anywhere else.
- Domain modules (`auth.ts`, `characters.ts`, etc.) export named functions. Import those, never the client directly.

### Auth Store
- Zustand `src/store/auth.ts` holds the decoded user payload only.
- Set by `login()` and `register()` in `src/utils/api/auth.ts` after a successful C# response.
- Cleared by `logout()` and by the Axios 401 interceptor when refresh fails.
- Never set it manually anywhere else — auth state must only come from a verified C# response.

### Types
- All shared types live in `src/types/`, organized by domain. Every API/form shape gets a Zod schema, and its `z.infer<>` type is declared in the same file right below it — schema and type never live apart.
- A large domain is a folder of small files with a barrel `index.ts` (e.g. `src/types/character/`); always import from the barrel (`@/types/character`), never reach into an internal file. A small domain is a single file (`src/types/user.ts`).
- The same schema validates form input (RHF resolver), parses API responses, and produces the TypeScript type.
- No hand-written interfaces for anything that comes from the API — write a Zod schema and infer the type.
- **Component prop types are the exception**: keep `FooProps` inline at the top of the component's own file, never in `src/types/`.
- See [docs/zod.md](docs/zod.md) for the full rule table and a worked example.

### Forms
- React Hook Form + Zod resolver everywhere. No exceptions.
- Server Actions for simple single-step mutations. RHF client-side for multi-step wizards (character creation).

### Code Style
- No comments on obvious code. Comment only when the why is non-obvious.
- No abbreviated names. `characterId` not `cid`, `error` not `err`, `event` not `e`.

### Styling
- Tailwind v4 utility-first. No CSS Modules, no styled-components, no custom CSS except `@media print`.
- UI primitives in `src/components/ui/` built on Base UI. Use `cva` for variants and `cn()` for merging.
- Dark mode via `data-theme="dark"` on the root element. Never use the `.dark` class.

### Print Route
- `/characters/[id]/print` has no app shell and no nav.
- `@media print` CSS only — no JS dependencies that would break print layout.

---

## Pages & Routes

| URL | Purpose | Auth |
|---|---|---|
| `/` | Landing | No |
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
NEXT_PUBLIC_API_URL=   # C# backend base URL (e.g. http://localhost:5000)
JWT_SECRET=            # Shared with C# — used by jose to verify JWT signatures locally
```

No other secrets belong here. OAuth credentials and JWT signing live in C# configuration.

---

## Testing

- **Unit**: Vitest + React Testing Library for components and hooks
- **E2E**: Playwright — runs against real dev backend via Docker Compose. No API mocking in E2E.
  - "Register → create character → print sheet"
  - "Login → level up → view changes"
- Test files colocate next to what they test (`__tests__/` subfolder or `.test.tsx` sibling)

---

## Nice-to-Haves (post-MVP)

- DM/Admin panel with role-based access
- Party system + invite codes
- Initiative tracker
- Session log notes
- "Table mode" — big-font modifier view for at-table use
- Session scheduling / calendar
- Offline support
- Spell slots tracker
- Conditions tracker
- Multi-classing

---

## What NOT to Do

- Do not create `middleware.ts` — deprecated in Next.js 16. Use `proxy.ts` with an exported `proxy` function
- Do not install any auth library (`better-auth`, `next-auth`, etc.) — C# owns auth end to end
- Do not implement OAuth flows on the frontend — use a plain `<a>` tag pointing to the C# initiation URL
- Do not call `getSession()` directly from layouts or Server Actions — always call `verifySession()` from `src/lib/dal.ts`
- Do not import anything from `src/lib/` in a Client Component — server-only, will break at runtime
- Do not store the JWT in JavaScript — the token lives in the HttpOnly cookie only, forever
- Do not add `Authorization: Bearer` to the Axios client — auth is cookie-based, the browser sends it automatically
- Do not put the token in Zustand — only the decoded user payload belongs in the store
- Do not handle 401s outside the Axios interceptor — one place, consistent behaviour
- Do not call `GET /api/auth/me` on every render — decode the JWT locally with jose
- Do not compute D&D stats or modifiers on the frontend — backend's job
- Do not use the Pages Router — App Router only
- Do not fetch in `useEffect` — use Server Components for initial data, or Axios calls in event handlers for client-side fetches
- Do not put secrets in `NEXT_PUBLIC_*` env vars
- Do not use `any` in TypeScript without a comment explaining why
- Do not write plain TypeScript interfaces for API shapes — write a Zod schema and infer the type
