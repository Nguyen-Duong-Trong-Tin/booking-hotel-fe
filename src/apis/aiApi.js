import apiClient from "./httpClient";

export const chatRooms = async ({ message, limit }) => {
  const response = await apiClient.post("/v1/ai/rooms/chat", {
    message,
    limit
  });
  return response.data;
};
