import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/utils/api/auth";
import { queryKeys } from "@/utils/api/query-keys";

/**
 * The logged-in user, from /api/me. `data` is the user, `null` when logged out,
 * `undefined` while the first request is in flight. The single source of truth for "who am I".
 */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60_000,
    // Refetch on every tab focus (not only when stale): catches a logout in another tab.
    refetchOnWindowFocus: "always",
  });
}
