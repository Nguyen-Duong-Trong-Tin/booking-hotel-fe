import apiClient from "./httpClient";

export const getAmenities = async ({ page, size, name }) => {
  const response = await apiClient.get("/v1/amenities", {
    params: {
      page,
      size,
      name: name || undefined
    }
  });
  return response.data;
};

export const createAmenity = async (data) => {
  const response = await apiClient.post("/v1/amenities", data);
  return response.data;
};

export const updateAmenity = async (id, data) => {
  const response = await apiClient.patch(`/v1/amenities/${id}`, data);
  return response.data;
};

export const deleteAmenity = async (id) => {
  const response = await apiClient.delete(`/v1/amenities/${id}`);
  return response.data;
};