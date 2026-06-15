# Auth — how it works

How login, sessions, the route gate, and token refresh actually work in this
frontend. Written to the real code so you can change it without guessing.

> **Heads up:** CLAUDE.md's Auth section has drifted from the implementation.
> Where they disagree, **this doc + the code win**. The known mismatches are
> listed at the bottom.

---

## The one idea: C# owns auth, the frontend just reflects it

The C# backend owns everything that matters — user records, passwords, the JWT,
its signature, and expiry. The frontend never stores a credential. It only:

1. **Decodes** the JWT locally with [`jose`](https://github.com/panva/jose) — no
   network call — to know who's logged in.
2. **Redirects** unauthenticated users to `/login` (and logged-in users away from
   the auth pages).
3. **Holds the decoded user** in a Zustand store so client components can read it
   instantly.

The token lives in an **HttpOnly cookie** (`access_token`) that JavaScript can't
read. The browser sends it automatically because the Axios client sets
`withCredentials: true`. There's also a refresh-token cookie, managed entirely by
C#.

---

## The pieces

| File | Job |
|---|---|
| [src/proxy.ts](../src/proxy.ts) | Edge gate. Runs on every request, `jwtVerify`s the cookie, redirects. |
| [src/lib/session.ts](../src/lib/session.ts) | `getSession()` — server-side: decode the cookie → `User \| null`. Cached per request. |
| [src/lib/guard.ts](../src/lib/guard.ts) | `verifySession()` (redirect if no user) and `verifyRole()` (post-MVP placeholder). |
| [src/store/auth.ts](../src/store/auth.ts) | Zustand store. Holds the decoded `user` in memory — never the token. |
| [src/providers/AuthProvider.tsx](../src/providers/AuthProvider.tsx) | Seeds the store from the server on load + wires the 401 callback. |
| [src/utils/api/auth.ts](../src/utils/api/auth.ts) | `login()`, `register()`, `logout()` — call C# and update the store. |
| [src/utils/api/client.ts](../src/utils/api/client.ts) | The Axios instance + the 401 refresh interceptor. |
| [src/hooks/useSession.ts](../src/hooks/useSession.ts) | `useSession()` — read the user from the store on the client. No network. |

---

## Login, end to end

1. The user submits the form ([Login/index.tsx](../src/components/Login/index.tsx)).
2. `login(data)` POSTs to **`/api/login`** with `{ email, password }`.
3. C# validates, then sets the `access_token` (and refresh) HttpOnly cookies. The
   JWT never touches JavaScript.
4. `login()` reads the user off the response and validates it:
   `userSchema.safeParse(response.data.loginResponse)`. On success it calls
   `setUser(...)` to put the user in the store. (`safeParse`, not `parse` — a shape
   mismatch won't block the login; there's a TODO to harden this.)
5. The form redirects to `/dashboard`.

`register()` is the same shape against **`/api/register`**, but redirects to
**`/login`** afterward (not the dashboard).

`logout()` POSTs **`/api/logout`** and **always** clears the store in a `finally`
block — even if the request fails, the client forgets the user.

---

## How the session is read

**On the server** (and the edge), the JWT is verified with the shared
`JWT_SECRET`:

- [proxy.ts](../src/proxy.ts) runs on every matched request. Public paths
  (`/`, `/login`, `/register`) are allowed through; everything else needs a valid
  token or it redirects to `/login`. A logged-in user landing on `/login` or
  `/register` gets bounced to `/dashboard`.
- [getSession()](../src/lib/session.ts) reads the `access_token` cookie, runs
  `jwtVerify`, and maps the JWT claims to our `User`:
  `unique_name → identifier`, `name → displayName`, `email → email`. It's wrapped
  in React `cache()`, so multiple calls in one render cost one decode. Returns
  `null` if the token is missing or invalid.
- [verifySession()](../src/lib/guard.ts) wraps `getSession()` and `redirect`s to
  `/login` when it's `null` — use it in server components/actions that require a
  user.

**On the client**, there's no network call: [useSession()](../src/hooks/useSession.ts)
just reads `user` from the Zustand store and returns `{ user, isLoggedIn }`.

**How the store gets populated:** the root layout calls `getSession()` on the
server and passes the result down as `initialUser` →
[Providers](../src/providers/index.tsx) → [AuthProvider](../src/providers/AuthProvider.tsx),
which calls `setUser(initialUser)` once on mount. So after a full page load the
store already knows the user, decoded from the cookie — no flash, no fetch.

---

## The 401 refresh flow

When an access token expires, the next API call gets a 401. The interceptor in
[client.ts](../src/utils/api/client.ts) handles it transparently:

1. A 401 comes back (and it isn't itself the refresh or logout call, and hasn't
   already been retried).
2. The request is marked `_retry = true` so it can only trigger one refresh.
3. **If a refresh is already in flight** (`isRefreshing === true`), the request is
   parked in `queuedRequests` instead of firing its own refresh. This is the key
   detail: ten concurrent 401s cause **one** refresh, not ten.
4. Otherwise it sets `isRefreshing = true` and POSTs **`/api/refresh`** (C#
   validates the refresh-token cookie and sets a fresh `access_token`).
5. **On success:** `retryQueuedRequests()` drains the queue (re-firing each parked
   request) and the original request is retried with the new cookie.
6. **On failure:** the queue is rejected, `onAuthFailure()` runs — which
   `clearUser()`s the store and `router.push("/login")`s — and the error
   propagates. `onAuthFailure` is registered by `AuthProvider` on mount via
   `setOnAuthFailure`.

> **Recent fix:** the guard that detects "is this the refresh request itself?"
> compared against `/api/auth/refresh`, but the actual call is to `/api/refresh` —
> so it never matched. It's now `/api/refresh`, which prevents a refresh response's
> own 401 from triggering another refresh.

---

## Roles (post-MVP)

`verifyRole()` in [guard.ts](../src/lib/guard.ts) is a placeholder — it currently
calls `verifySession()` and then always `redirect("/")`. Real role checks wait on
C# returning roles in the JWT.

---

## Gotchas

- **The store is in-memory** — no `persist` middleware. A hard refresh empties it,
  then `AuthProvider` re-seeds it from the cookie via SSR. Don't add persistence;
  the cookie is the source of truth.
- **The token is never in JS.** Don't read it, store it, or add an
  `Authorization` header. `withCredentials: true` sends the cookie for you.
- **`JWT_SECRET` must match C# exactly** — it's used by both `proxy.ts` and
  `session.ts` to verify the signature locally. A mismatch makes every session
  look invalid.
- **`safeParse` swallows a malformed user** — if C#'s `loginResponse` shape
  changes, `login()` silently skips the store update instead of throwing. There's
  a TODO to surface that.
- **Cookie name is `access_token`** — referenced in both `proxy.ts` and
  `session.ts`.

---

## Where CLAUDE.md is out of date

CLAUDE.md's Auth section predates the implementation. Trust the code; these are
the specific drifts (this doc reflects reality):

| CLAUDE.md says | Actually |
|---|---|
| Endpoints are `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, … | `/api/login`, `/api/register`, `/api/refresh`, `/api/logout` (no `/auth/` prefix) |
| The DAL lives in `src/lib/dal.ts` | It's `src/lib/guard.ts` (`verifySession`/`verifyRole`) |
| The `(app)` layout calls `verifySession()` | The root layout calls `getSession()`; `proxy.ts` does the redirecting |
| `useSession()` returns `{ user, isLoading: false }` | Returns `{ user, isLoggedIn }` |
| Register lands on `/dashboard` | Register redirects to `/login` |
