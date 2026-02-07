import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken
} from "./tokenStorage";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const defaultHeaders = {
  "Content-Type": "application/json"
};

const apiClient = axios.create({
  baseURL,
  headers: defaultHeaders
});

const rawClient = axios.create({
  baseURL,
  headers: defaultHeaders
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken || !refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await rawClient.post("/v1/auth/refresh-token", {
        accessToken,
        refreshToken
      });
      const newAccessToken = refreshResponse?.data?.data?.accessToken;

      if (!newAccessToken) {
        clearTokens();
        return Promise.reject(error);
      }

      setAccessToken(newAccessToken);
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearTokens();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
