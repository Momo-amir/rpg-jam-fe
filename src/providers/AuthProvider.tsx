"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setOnAuthFailure } from "@/utils/api/client";
import { useAuthStore } from "@/store/auth";
import { type User } from "@/types/user";

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  if (initialUser && useAuthStore.getState().user === null) {
    useAuthStore.setState({ user: initialUser });
  }

  useEffect(() => {
    setOnAuthFailure(() => {
      clearUser();
      router.push("/login");
    });
  }, [router, clearUser]);

  return <>{children}</>;
}
