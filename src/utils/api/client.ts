import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // this is the request part of the setup, we need to only handle response
});

type OnAuthFailure = () => void;
let onAuthFailure: OnAuthFailure = () => {};

export function setOnAuthFailure(callback: OnAuthFailure) {
  onAuthFailure = callback;
}

let isRefreshing = false;

// TODO make sure we queue requests that come in while we're refreshing so we don't have multiple refresh requests going out at the same time, and also make sure to retry those queued requests once we get a new token.
// Refresh token should silenetly extend the session without the user having to log in again.

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message =
      error.response?.data?.message ??
      error.message ??
      "Unexpected server error";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/api/auth/refresh");
        isRefreshing = false;
        return apiClient(originalRequest);
      } catch {
        isRefreshing = false;
        onAuthFailure();
        return Promise.reject(new Error(message));
      }
    }

    return Promise.reject(new Error(message));
  },
);
