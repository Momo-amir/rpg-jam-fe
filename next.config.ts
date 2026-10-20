import type { NextConfig } from "next";

const apiUrl = process.env.API_URL;
if (!apiUrl) {
  throw new Error("API_URL is not set. Add it to .env.local (e.g. API_URL=http://localhost:9096).");
}

const nextConfig: NextConfig = {
  // The browser only talks to this origin. /api/* is forwarded to the C# API,
  // so its auth cookie is first-party and no CORS is needed.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

export default nextConfig;
