import apiClient from "./httpClient";

export const loginAdmin = async ({ email, password }) => {
  const response = await apiClient.post("/v1/auth/login", { email, password });
  return response.data;
};

export const refreshToken = async ({ accessToken, refreshToken }) => {
  const response = await apiClient.post("/v1/auth/refresh-token", {
    accessToken,
    refreshToken
  });
  return response.data;
};

