import apiClient from "./httpClient";

export const getRooms = async ({ page, size, roomNumber, status, categoryName }) => {
  const response = await apiClient.get("/v1/rooms", {
    params: {
      page,
      size,
      roomNumber: roomNumber || undefined,
      status: status || undefined,
      categoryName: categoryName || undefined,
    }
  });
  return response.data;
};

export const createRoom = async (data) => {
  const response = await apiClient.post("/v1/rooms", data);
  return response.data;
};

export const updateRoom = async (id, data) => {
  const response = await apiClient.patch(`/v1/rooms/${id}`, data);
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await apiClient.delete(`/v1/rooms/${id}`);
  return response.data;
};