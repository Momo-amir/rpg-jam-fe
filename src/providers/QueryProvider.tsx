"use client";

import { useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@/utils/api/fetch";
import { queryKeys } from "@/utils/api/query-keys";
import { LOGIN_PATH, PUBLIC_PATHS } from "@/lib/auth";

function makeQueryClient() {
  const client: QueryClient = new QueryClient({
    // Only queries, never mutations: a wrong password (401 from /api/login) must not redirect.
    queryCache: new QueryCache({
      onError: (error) => {
        if (!(error instanceof ApiError)) return;

        if (error.status === 403) {
          // Roles may have changed; refetch who we are.
          void client.invalidateQueries({ queryKey: queryKeys.me });
          return;
        }

        if (error.status === 401) {
          // Session expired or revoked. A full page load drops every cached byte of the old session.
          const { pathname, search } = window.location;
          if (PUBLIC_PATHS.includes(pathname)) return;
          window.location.replace(`${LOGIN_PATH}?from=${encodeURIComponent(pathname + search)}`);
        }
      },
    }),
    defaultOptions: {
      queries: {
        // Don't retry 4xx: a 401 should reach the handler above immediately.
        retry: (count, error) => !(error instanceof ApiError && error.status < 500) && count < 2,
      },
    },
  });
  return client;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // One client per browser tab (and per server render), never shared between users.
  const [client] = useState(makeQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
