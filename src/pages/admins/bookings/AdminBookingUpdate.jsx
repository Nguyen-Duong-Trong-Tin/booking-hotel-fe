import { Modal, Form, Select, DatePicker, InputNumber, message } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function AdminBookingUpdate({ open, initialValues, rooms = [], users = [], onCancel, onSubmit, loading }) {
  const [form] = Form.useForm();

  // Đổ dữ liệu cũ vào form mỗi khi Modal được mở hoặc initialValues thay đổi
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        roomId: initialValues.room?.id,
        userId: initialValues.user?.id,
        totalPrice: initialValues.totalPrice,
        status: initialValues.status,
        // Quan trọng: Chuyển chuỗi ngày từ Backend thành đối tượng dayjs để DatePicker hiển thị được
        dates: [
          initialValues.checkIn ? dayjs(initialValues.checkIn) : null,
          initialValues.checkOut ? dayjs(initialValues.checkOut) : null,
        ],
      });
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        checkIn: values.dates[0].format("YYYY-MM-DD"),
        checkOut: values.dates[1].format("YYYY-MM-DD"),
        totalPrice: values.totalPrice, 
        status: values.status,
        roomId: values.roomId,
        userId: values.userId, 
      };
      await onSubmit(payload);
    } catch (error) {
      console.error("Update validation failed:", error);
    }
  };

  return (
    <Modal 
      title="Update Booking" 
      open={open} 
      onOk={handleOk} 
      onCancel={() => {
        form.resetFields();
        onCancel();
      }} 
      confirmLoading={loading} // Hiển thị trạng thái đang lưu
      destroyOnClose // Xóa trắng component khi đóng để tránh lưu log dữ liệu cũ
      okText="Save Changes"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Customer" name="userId" rules={[{ required: true }]}>
          <Select showSearch placeholder="Select customer" optionFilterProp="children">
            {(Array.isArray(users) ? users : []).map(u => (
              <Select.Option key={u.id} value={u.id}>{u.fullName}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Room" name="roomId" rules={[{ required: true }]}>
          <Select placeholder="Select room">
            {(Array.isArray(rooms) ? rooms : []).map(r => (
              <Select.Option key={r.id} value={r.id}>Room {r.roomNumber}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Stay Dates" name="dates" rules={[{ required: true }]}>
          <DatePicker.RangePicker style={{ width: '100%' }} format="MM/DD/YYYY" />
        </Form.Item>

        <Form.Item label="Total Price" name="totalPrice" rules={[{ required: true }]}>
          {/* Giống trang Create: Không có .00, dùng addonBefore */}
          <InputNumber 
            className="w-full" 
            min={0}
            addonBefore="$"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="PENDING">Pending</Select.Option>
            <Select.Option value="CONFIRMED">Confirmed</Select.Option>
            <Select.Option value="CANCELLED">Cancelled</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}