import apiClient from "./httpClient";

export const uploadRoomImages = async ({ roomId, images, presentativeIndex }) => {
  const formData = new FormData();
  formData.append("roomId", roomId);

  if (presentativeIndex !== undefined && presentativeIndex !== null) {
    formData.append("presentativeIndex", presentativeIndex);
  }

  images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await apiClient.post("/v1/room-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

export const deleteRoomImage = async (id) => {
  const response = await apiClient.delete(`/v1/room-images/${id}`);
  return response.data;
};

export const setRoomImagePresentative = async (id) => {
  const response = await apiClient.patch(`/v1/room-images/${id}/presentative`);
  return response.data;
};
