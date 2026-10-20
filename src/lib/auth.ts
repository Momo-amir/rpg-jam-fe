// HttpOnly auth cookie set by the C# API (ASP.NET Identity cookie authentication).
// JavaScript never reads it; the proxy only checks that it exists.
export const AUTH_COOKIE = "__Host-auth";

export const LOGIN_PATH = "/login";
export const HOME_PATH = "/dashboard";

// Only pages reachable without logging in. Everything else is protected.
export const PUBLIC_PATHS: readonly string[] = ["/", "/login", "/register"];

/** `from` only if it's a path on this site, otherwise HOME_PATH (blocks /login?from=https://evil.com). */
export function safeRedirectPath(from: string | null | undefined): string {
  if (!from || !from.startsWith("/") || from.startsWith("//") || from.startsWith("/\\")) {
    return HOME_PATH;
  }
  return from;
}
