import { Modal, Form, Select, DatePicker, InputNumber, Button } from "antd";

export default function AdminBookingCreate({ open, loading, rooms = [], users = [], onCancel, onSubmit }) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields(); 
    onCancel();
  };

  return (
    <Modal
      title="Create New Booking"
      open={open}
      confirmLoading={loading}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      destroyOnClose
      okText="Create"
      cancelText="Cancel"
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={(values) => {
          const payload = {
            checkIn: values.dates[0].format("YYYY-MM-DD"),
            checkOut: values.dates[1].format("YYYY-MM-DD"),
            totalPrice: values.totalPrice, 
            roomId: values.roomId,
            userId: values.userId,
            status: values.status || "PENDING",
          };
          onSubmit(payload);
          form.resetFields();
        }}
        initialValues={{ status: "PENDING", totalPrice: 0 }}
      >
        <Form.Item label="Customer" name="userId" rules={[{ required: true, message: "Required!" }]}>
          <Select showSearch placeholder="Select customer" optionFilterProp="children">
            {(Array.isArray(users) ? users : []).map((u) => (
              <Select.Option key={u.id} value={u.id}>{u.fullName} ({u.email})</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Room" name="roomId" rules={[{ required: true, message: "Required!" }]}>
          <Select placeholder="Select room">
            {(Array.isArray(rooms) ? rooms : []).map((r) => (
              <Select.Option key={r.id} value={r.id}>Room {r.roomNumber}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Stay Dates" name="dates" rules={[{ required: true }]}>
          <DatePicker.RangePicker style={{ width: '100%' }} format="MM/DD/YYYY" />
        </Form.Item>

        <Form.Item label="Total Price" name="totalPrice" rules={[{ required: true }]}>
          <InputNumber 
            className="w-full" 
            placeholder="Enter price"
            min={0}
            addonBefore="$"
            // Formatter & Parser chỉ xử lý số nguyên
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select>
            <Select.Option value="PENDING">Pending</Select.Option>
            <Select.Option value="CONFIRMED">Confirmed</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}