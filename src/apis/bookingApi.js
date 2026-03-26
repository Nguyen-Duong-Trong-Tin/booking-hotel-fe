import apiClient from "./httpClient";

// 1. Lấy danh sách Booking - Gửi tham số theo BookingFindDto
export const getBookings = async (params) => {
  const response = await apiClient.get("/v1/bookings", {
    params: {
      sort: "id,desc",
      ...(params || {})
    }
  });
  return response.data;
};

// 2. Tạo mới Booking - Gửi dữ liệu theo BookingCreateDto
export const createBooking = async (data) => {
  const response = await apiClient.post("/v1/bookings", data);
  return response.data;
};

// 3. Cập nhật Booking - Gửi dữ liệu theo BookingUpdateDto
export const updateBooking = async (id, data) => {
  // Thay .put bằng .patch
  const response = await apiClient.patch(`/v1/bookings/${id}`, data); 
  return response.data;
};

// 4. Cập nhật trạng thái (Dành cho việc đổi status nhanh trên bảng)
export const updateBookingStatus = async (id, status) => {
  const response = await apiClient.patch(`/v1/bookings/${id}/status`, { status });
  return response.data;
};

// 5. Xóa Booking
export const deleteBooking = async (id) => {
  const response = await apiClient.delete(`/v1/bookings/${id}`);
  return response.data;
};

// 6. Lấy danh sách phòng - Dùng để đổ dữ liệu vào ô chọn (Select) roomId
export const getRooms = async () => {
  const response = await apiClient.get("/v1/rooms");
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await apiClient.get(`/v1/bookings/${id}`);
  return response.data;
};