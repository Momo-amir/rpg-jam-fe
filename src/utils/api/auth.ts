import { apiFetch, ApiError } from "@/utils/api/fetch";
import { meSchema, type User } from "@/types/user";
import type { LoginFormValues, RegisterFormValues } from "@/types/auth";

export const login = (data: LoginFormValues) =>
  apiFetch("/api/login", meSchema, { method: "POST", body: data });

export const register = (data: RegisterFormValues) =>
  apiFetch("/api/register", meSchema, {
    method: "POST",
    body: { displayName: data.displayName, email: data.email, password: data.password },
  });

export const logout = () => apiFetch("/api/logout", undefined, { method: "POST" });

/** The logged-in user, or null. "Not logged in" is an answer, not an error. */
export async function fetchMe(): Promise<User | null> {
  try {
    return await apiFetch("/api/me", meSchema);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}
