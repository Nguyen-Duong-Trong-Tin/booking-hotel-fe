import apiClient from "./httpClient";

/**
 * Lấy danh sách tiện ích của phòng (dựa trên RoomAmenityFindDto)
 */
export const getRoomAmenities = async ({ page, size, roomId, amenityId, description }) => {
  const response = await apiClient.get("/v1/room-amenities", {
    params: {
      page,
      size,
      sort: "id,desc",
      roomId: roomId || undefined,
      amenityId: amenityId || undefined,
      description: description || undefined,
    }
  });
  return response.data;
};

/**
 * Gán tiện ích cho một phòng (dựa trên RoomAmenityCreateDto)
 */
export const createRoomAmenity = async (data) => {
  const response = await apiClient.post("/v1/room-amenities", data);
  return response.data;
};

/**
 * Cập nhật thông tin tiện ích của phòng (dựa trên RoomAmenityUpdateDto)
 */
export const updateRoomAmenity = async (id, data) => {
  const response = await apiClient.patch(`/v1/room-amenities/${id}`, data);
  return response.data;
};

/**
 * Xóa tiện ích khỏi phòng
 */
export const deleteRoomAmenity = async (id) => {
  const response = await apiClient.delete(`/v1/room-amenities/${id}`);
  return response.data;
};

