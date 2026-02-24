import apiClient from "./httpClient";

export const getRoles = async ({ page, size, name, description }) => {
  const response = await apiClient.get("/v1/roles", {
    params: {
      page,
      size,
      name: name || undefined,
      description: description || undefined
    }
  });
  return response.data;
};

export const createRole = async ({ name, description }) => {
  const response = await apiClient.post("/v1/roles", {
    name,
    description
  });
  return response.data;
};

export const updateRole = async ({ id, name, description }) => {
  const response = await apiClient.patch(`/v1/roles/${id}`, {
    name,
    description
  });
  return response.data;
};

export const deleteRole = async (id) => {
  const response = await apiClient.delete(`/v1/roles/${id}`);
  return response.data;
};
