import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const publicPaths = ["/", "/login", "/register"];

export async function proxy(request: NextRequest) {
  const isPublic = publicPaths.some((path) =>
    path === "/"
      ? request.nextUrl.pathname === "/"
      : request.nextUrl.pathname.startsWith(path),
  );

  const token = request.cookies.get("access_token")?.value;

  if (!isPublic) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    try {
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (isPublic && token) {
    try {
      await jwtVerify(token, secret);
      if (request.nextUrl.pathname !== "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // Invalid token on public page — just let them through
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
