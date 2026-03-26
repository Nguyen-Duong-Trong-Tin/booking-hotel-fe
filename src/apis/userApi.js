import apiClient from "./httpClient";

export const getUsers = async ({ page, size, fullName, email, phone, roleName }) => {
  const response = await apiClient.get("/v1/users", {
    params: {
      page,
      size,
      sort: "id,desc",
      fullName: fullName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      roleName: roleName || undefined,
    }
  });
  return response.data;
};

export const createUser = async (data) => {
  const response = await apiClient.post("/v1/users", data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await apiClient.patch(`/v1/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/v1/users/${id}`);
  return response.data;
};

export const updateMyProfile = async (data) => {
  const response = await apiClient.patch("/v1/users/me", data);
  return response.data;
};