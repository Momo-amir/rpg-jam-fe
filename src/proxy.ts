import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, LOGIN_PATH, PUBLIC_PATHS } from "@/lib/auth";

// UX gate only: the API checks the session on every request, so a fake cookie gets an empty page and 401s.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || request.cookies.has(AUTH_COOKIE)) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("from", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Skip /api (the C# API does its own auth), Next internals and files.
  matcher: ["/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
