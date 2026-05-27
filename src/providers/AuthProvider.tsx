"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setOnAuthFailure } from "@/utils/api/client";
import { useAuthStore } from "@/store/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    setOnAuthFailure(() => {
      clearUser();
      router.push("/login");
    });
  }, [router, clearUser]);

  return <>{children}</>;
}
