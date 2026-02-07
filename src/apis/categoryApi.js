import apiClient from "./httpClient";

export const getCategories = async ({ page, size, name, description }) => {
  const response = await apiClient.get("/v1/categories", {
    params: {
      page,
      size,
      name: name || undefined,
      description: description || undefined
    }
  });
  return response.data;
};

export const createCategory = async ({ name, description }) => {
  const response = await apiClient.post("/v1/categories", {
    name,
    description
  });
  return response.data;
};

export const updateCategory = async ({ id, name, description }) => {
  const response = await apiClient.patch(`/v1/categories/${id}`, {
    name,
    description
  });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/v1/categories/${id}`);
  return response.data;
};
