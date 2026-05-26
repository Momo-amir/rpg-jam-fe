import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // this handles the request part of the setup, we need to only handle response
});

type OnAuthFailure = () => void;
let onAuthFailure: OnAuthFailure = () => {};

export function setOnAuthFailure(callback: OnAuthFailure) {
  onAuthFailure = callback;
}

let isRefreshing = false;

// Refresh token should silenetly extend the session without the user having to log in again.
// a route akin to api/auth/refresh would make it so we can tighten security keep the JWT short lived (like an hour) but instead of logging us out there we take the 401 request timed out and serve a new token to the frontend that is then kept in store.
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
