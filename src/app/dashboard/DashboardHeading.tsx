"use client";

import { useMe } from "@/hooks/useMe";

export function DashboardHeading() {
  const { data: user } = useMe();
  // Skeleton while /api/me loads, so the page never flashes a wrong name.
  if (!user) return <h2 className='h-10 w-64 animate-pulse rounded bg-primary/10' aria-busy='true' />;
  return <h2>{user.displayName}&apos;s Dashboard</h2>;
}
