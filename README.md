# RPG Jam — Frontend

D&D/TTRPG platform for character building, party management, session scheduling, and at-table digital helpers. Consumes a C# ASP.NET Core Web API.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires the backend running via Docker Compose (see backend repo).

## Architecture

The app uses the Next.js App Router for routing and a conventional folder structure for everything else.

**`src/app/`** is routing only. Pages fetch data server-side and pass it down to components. No business logic lives here.

**`src/components/`** holds all React components. `ui/` contains hand-built primitives on top of Base UI (Button, Input, etc.).

**`src/utils/`** holds all reused non-component logic. Each file is named after what it does — `cn.ts`, `formatDate.ts`, etc.

**`src/types/`** is where all shared types live, grouped by domain. Zod schemas are the source of truth — the inferred `z.infer<>` type sits in the same file. Large domains are a folder + barrel (`@/types/character`); component prop types stay inline with their component. See [docs/zod.md](docs/zod.md).

**`src/providers/`** wraps the app with context needed everywhere: auth session, TanStack Query client, and theme.

**`src/hooks/`** contains custom hooks so components can share logic without duplicating it.

### API — two separate things

**`src/app/api/`** — Next.js route handlers running inside this app. Currently none needed for auth — C# owns all auth endpoints. Can add webhooks later if needed.

**`src/utils/api/`** — Where the frontend talks to the C# backend. `client.ts` is an Axios instance with `withCredentials: true` and the base URL baked in. Domain modules sit on top.

## Auth architecture

**C# ASP.NET Core Identity is the sole source of truth** — users, passwords, roles, and the entire OAuth dance. There is no auth library on the frontend.

1. **Login** — form calls `POST /api/auth/login` on C#; C# sets an `HttpOnly; Secure; SameSite=Lax` cookie containing the JWT directly on the response
2. **Register** — form calls `POST /api/auth/register` on C#; same cookie behaviour
3. **Social login (GitHub, Google)** — browser is redirected to C#'s OAuth initiation URL (`GET /api/auth/github`); C# owns the entire OAuth flow and sets the cookie on callback, then redirects back to `/dashboard`
4. **Roles** — C# puts roles in the JWT; `getSession()` / `useSession()` return them; frontend never computes or assigns roles
5. **Session persistence** — the `HttpOnly` cookie survives page refreshes and browser restarts until C# expires it; no frontend secret needed
6. **Route protection** — `proxy.ts` checks cookie presence on every request and redirects to `/login` early; the `(app)` layout calls `getSession()` (which hits `GET /api/auth/me`) as the real auth gate
7. **API calls** — Axios sends the cookie automatically via `withCredentials: true`; the JWT never touches JavaScript

### C# endpoints the frontend depends on

| Method | Path | What it does |
|---|---|---|
| `POST` | `/api/auth/login` | Verify credentials, set cookie, return `{ user }` |
| `POST` | `/api/auth/register` | Create user, set cookie, return `{ user }` |
| `POST` | `/api/auth/logout` | Clear cookie |
| `GET` | `/api/auth/me` | Validate token, return `{ user }` or `401` |
| `GET` | `/api/auth/github` | Initiate GitHub OAuth redirect |
| `GET` | `/api/auth/google` | Initiate Google OAuth redirect |
| `GET` | `/api/auth/callback/github` | Complete OAuth, set cookie, redirect to `/dashboard` |
| `GET` | `/api/auth/callback/google` | Complete OAuth, set cookie, redirect to `/dashboard` |

## Libraries

### Auth & Sessions

No auth library. Auth is two small files:
- `src/lib/session.ts` — `getSession()` server-side helper, calls `GET /api/auth/me`, used in layouts and Server Actions
- `src/hooks/useSession.ts` — `useSession()` client hook backed by TanStack Query, used in Client Components

### UI & Styling
| Package | Role |
|---|---|
| `@base-ui/react` | Headless, accessible, React 19 native primitives. We build our own styled components on top |
| `class-variance-authority` | Type-safe variant builder — used inside every UI primitive for `variant` and `size` props |
| `tw-animate-css` | CSS animation keyframes companion for Tailwind v4 |
| `lucide-react` | Icon library — `import { Sword } from "lucide-react"` then `<Sword className="size-4" />` |

### Forms & Validation
| Package | Role |
|---|---|
| `react-hook-form` | Controlled form management, used for login, register, and the character creation wizard |
| `@hookform/resolvers` | Connects Zod schemas to RHF as the validation resolver |
| `zod` | Schema validation and type inference — schemas in `src/types/` double as TypeScript types |

### API & Data
| Package | Role |
|---|---|
| `axios` | HTTP client — one configured instance with base URL and auth token interceptor |
| `@tanstack/react-query` | Client-side mutation state and cache invalidation (HP tracking, initiative, etc.) |

### Utilities
| Package | Role |
|---|---|
| `clsx` | Composing conditional class name strings |
| `tailwind-merge` | Merges Tailwind classes without specificity conflicts; powers `cn()` in `src/utils/cn.ts` |

### Not yet installed
| Package | Role |
|---|---|
| `vitest` + `@testing-library/react` | Unit and component testing |
| `playwright` | End-to-end testing |
