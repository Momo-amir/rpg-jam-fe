# RPG Jam — Frontend

D&D/TTRPG platform for character building, party management, session scheduling, and at-table digital helpers. Consumes a C# ASP.NET Core Web API.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires the backend + database running via Docker Compose (see backend repo).

## Architecture

The app uses the Next.js App Router for routing and a conventional folder structure for everything else.

**`src/app/`** is routing only. Pages presents and fetches data server-side and pass it down to components. No business logic lives here.

**`src/components/`** holds all React components. `ui/` contains the base primitives - homemade or from shadcn (Button, Input, etc.)

**`src/utils/`** holds all reused utility non component logic. Each file is named after what it does — `cn.ts`, `formatDate.ts`, `getUrl.ts`, etc. 

**`src/types/`** is where all types live. Instead of writing TypeScript interfaces we can use Zod schemas and the type comes out automatically.

**`src/providers/`** wraps the app with context that needs to be available everywhere: auth session, TanStack Query client, and theme.

**`src/hooks/`** contains custom hooks so components can share logic without duplicating it.

### API — two separate things

**`src/app/api/`** — Next.js route handlers that run inside this app. Currently plannes is just `auth/[...all]/` for Better Auth. Can add webhooks if needed

**`src/utils/api/`** Where the frontend talks to the C# backend. `client.ts` or `axios.ts` is an Axios instance with the base URL and auth token baked in. Zod validates


## Libraries

### Auth & Sessions

**`better-auth`** handles the frontend side of auth:

1. On login, calls the C# `/api/auth/login` endpoint with the user's credentials
2. C# verifies them and returns a JWT
3. Better Auth wraps that JWT in an encrypted `HttpOnly` session cookie so it never touches the browser directly
4. `proxy.ts` reads that cookie on every request to redirect unauthenticated users early
5. Layouts and Server Actions call `auth.api.getSession()` to verify the session (proxy alone is not enough)
6. Client Components use `useSession()` from `better-auth/react`
7. The API client reads the session server-side and forwards the JWT as `Authorization: Bearer <token>` on all calls back to C#

**Social login (Google, GitHub etc.)** works through Better Auth's built-in `socialProviders` plugin, which handles the OAuth redirect and callback on the Next.js side. Once the user authenticates, Better Auth passes the verified profile to a C# endpoint (e.g. `POST /api/auth/social-login`), which upserts the user and returns a JWT that follows the same flow as above. Backend will need to add an endpoint for this. TBD

### UI & Styling
| Package | Role |
|---|---|
| `@base-ui/react` | Headless, accessible, React 19 native primitives. We build our own styled components on top of these — no unstyled component ships to users |
| `class-variance-authority` | Type-safe variant builder — used inside every UI primitive to define `variant` and `size` props |
| `tw-animate-css` | CSS animation keyframes companion for Tailwind v4 |
| `lucide-react` | Icon library — `import { Sword } from "lucide-react"` then `<Sword className="size-4" />` |

### API & Validation
| Package | Role |
|---|---|
| `axios` | HTTP client — configured as a single instance with base URL and auth token interceptor |
| `zod` | Schema validation and type inference — schemas in `src/utils/schemas/` or `types/example.ts`  doubles as TypeScript types |

### Component Utilities
| Package | Role |
|---|---|
| `clsx` | Utility for composing conditional class name strings |
| `tailwind-merge` | Merges Tailwind classes without specificity conflicts; powers the `cn()` helper in `src/utils/cn.ts` |

### Not yet installed — not confirmed yet
| Package | Role |
|---|---|
| `react-hook-form` | Controlled form management, used for the character creation wizard |
| `@tanstack/react-query` | Client-side data fetching and mutation state (HP tracking, initiative, etc.) |
| `vitest` + `@testing-library/react` | Unit and component testing |
| `playwright` | End-to-end testing |
