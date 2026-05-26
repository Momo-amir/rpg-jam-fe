import { apiClient } from "@/utils/api/client";
import { useAuthStore } from "@/store/auth";
import { userSchema } from "@/types/user";
import { type LoginFormValues, type RegisterFormValues } from "@/types/auth";

export async function login(data: LoginFormValues) {
  const response = await apiClient.post("/api/auth/login", data);
  const user = userSchema.parse(response.data.user);
  useAuthStore.getState().setUser(user);
  return user;
}

export async function register(data: RegisterFormValues) {
  const response = await apiClient.post("/api/auth/register", {
    username: data.username,
    email: data.email,
    password: data.password,
  });
  const user = userSchema.parse(response.data.user);
  useAuthStore.getState().setUser(user);
  return user;
}

export async function logout() {
  await apiClient.post("/api/auth/logout");
  useAuthStore.getState().clearUser();
}
