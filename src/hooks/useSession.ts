import { useAuthStore } from "@/store/auth";

//Reads from Zustand client-site equivelant of verifySession()

export function useSession() {
  const user = useAuthStore((state) => state.user);
  return { user, isLoggedIn: user !== null };
}
