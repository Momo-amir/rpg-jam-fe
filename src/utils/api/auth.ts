import { apiClient } from "@/utils/api/client";
import { useAuthStore } from "@/store/auth";
import { userSchema } from "@/models/schemas/user";
import {
  type LoginFormValues,
  type RegisterFormValues,
} from "@/models/schemas/auth";

export async function login(data: LoginFormValues) {
  const response = await apiClient.post("/api/login", data);
  // safeParse instead of parse so a shape mismatch doesn't block the login return.
  // TODO - Add better error handling for API response validation failure
  const user = userSchema.safeParse(response.data.loginResponse);

  if (user.success) {
    useAuthStore.getState().setUser(user.data);
  }
  return response.data;
}

export async function register(data: RegisterFormValues) {
  const response = await apiClient.post("/api/register", {
    displayName: data.displayName,
    email: data.email,
    password: data.password,
  });
  const user = userSchema.safeParse(response.data.loginResponse);
  if (user.success) useAuthStore.getState().setUser(user.data);
  return response.data;
}

export async function logout() {
  const user = useAuthStore.getState().user;
  try {
    await apiClient.post("/api/logout", { email: user?.email });
  } finally {
    useAuthStore.getState().clearUser();
  }
}
