import axios from "axios";
import { getAuthState, setAuth, clearAuth } from "./auth-store";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // sends the refresh-token cookie automatically
});

apiClient.interceptors.request.use((config) => {
  const { token } = getAuthState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshCall = originalRequest.url?.includes("/api/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      // De-dupe: if several requests 401 at once, only call /refresh once
      if (!refreshPromise) {
        refreshPromise = apiClient
          .post("/api/auth/refresh")
          .then(({ data }) => {
            setAuth({ token: data.token, role: data.role });
            return data.token as string;
          })
          .catch(() => {
            clearAuth();
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);