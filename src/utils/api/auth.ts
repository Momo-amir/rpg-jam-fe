import { apiClient } from "@/utils/api/client";
import { useAuthStore } from "@/store/auth";
import { userSchema } from "@/models/schemas/user";
import {
  type LoginFormValues,
  type RegisterFormValues,
} from "@/models/schemas/auth";

export async function login(data: LoginFormValues) {
  const response = await apiClient.post("/api/login", data);
  // safeParse returns { success, data } instead of throwing on mismatch when we login.
  // parse() used before would throw if the API response shape doesn't match userSchema,
  // blocking the return and preventing the token from being set in the store until user refreshes
  // TODO - Add better error handling for API response validation failure
  // TODO - Figure out what the user data shape is on the API response and update userSchema accordingly to avoid having to do this
  const user = userSchema.safeParse(response.data.user);
  if (user.success) useAuthStore.getState().setUser(user.data);
  return response.data;
}

export async function register(data: RegisterFormValues) {
  const response = await apiClient.post("/api/register", {
    username: data.username,
    email: data.email,
    password: data.password,
  });
  const user = userSchema.safeParse(response.data.user);
  if (user.success) useAuthStore.getState().setUser(user.data);
  return response.data;
}

export async function logout() {
  await apiClient.post("/api/auth/logout");
  useAuthStore.getState().clearUser();
}

