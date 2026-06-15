import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { OnAuthFailure } from "@/types/api";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let onAuthFailure: OnAuthFailure = () => {};

export function setOnAuthFailure(callback: OnAuthFailure) {
  onAuthFailure = callback;
}

let isRefreshing = false;

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type QueuedRequest = {
  config: RetriableRequestConfig;
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
  reject: (reason?: unknown) => void;
};

let queuedRequests: QueuedRequest[] = [];

function retryQueuedRequests(error?: unknown) {
  const requests = queuedRequests;
  queuedRequests = [];

  requests.forEach(({ config, resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(apiClient(config));
  });
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const message =
      error.response?.data?.message ??
      error.message ??
      "Unexpected server error";
    const isRefreshRequest = originalRequest?.url === "/api/refresh";
    const isLogoutRequest = originalRequest?.url === "/api/logout";

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !isRefreshRequest &&
      !isLogoutRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          queuedRequests.push({ config: originalRequest, resolve, reject });
        });
      }

      isRefreshing = true;

      try {
        await apiClient.post("/api/refresh");
        isRefreshing = false;
        retryQueuedRequests();
        return apiClient(originalRequest);
      } catch {
        const authError = new Error(message);
        isRefreshing = false;
        retryQueuedRequests(authError);
        onAuthFailure();
        return Promise.reject(authError);
      }
    }

    return Promise.reject(new Error(message));
  },
);
