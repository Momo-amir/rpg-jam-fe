"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setOnAuthFailure } from "@/utils/api/client";
import { useAuthStore } from "@/store/auth";

//TODO - taken from example web, rewrite as to rule out redundancy
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    setOnAuthFailure(() => {
      clearUser();
      router.push("/login");
    });
  }, [router, clearUser]);
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
