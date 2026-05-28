"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setOnAuthFailure } from "@/utils/api/client";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/models/schemas/user";

export function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  const store = useAuthStore.getState();
  if (user && store.user?.sub !== user.sub) store.setUser(user);

  useEffect(() => {
    setOnAuthFailure(() => {
      clearUser();
      router.push("/login");
    });
  }, [router, clearUser]);

  return <>{children}</>;
}
