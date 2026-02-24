import apiClient from "./httpClient";

/**
 * Lấy danh sách thanh toán (Phân trang & Tìm kiếm)
 * Khớp với PaymentFindDto của Backend
 */
export const getPayments = async ({ page, size, paymentMethod, status, paymentDate, bookingId }) => {
  const response = await apiClient.get("/v1/payments", {
    params: {
      page,
      size,
      paymentMethod: paymentMethod || undefined,
      status: status || undefined,
      paymentDate: paymentDate || undefined,
      bookingId: bookingId || undefined
    }
  });
  return response.data;
};

/**
 * Tạo mới thanh toán
 * Khớp với PaymentCreateDto
 */
export const createPayment = async (data) => {
  const response = await apiClient.post("/v1/payments", data);
  return response.data;
};

/**
 * Cập nhật thanh toán
 * Khớp với PaymentUpdateDto
 */
export const updatePayment = async (id, data) => {
  // Sử dụng patch theo phong cách file Category của bạn
  const response = await apiClient.patch(`/v1/payments/${id}`, data);
  return response.data;
};

/**
 * Xóa thanh toán
 */
export const deletePayment = async (id) => {
  const response = await apiClient.delete(`/v1/payments/${id}`);
  return response.data;
};