import { Modal, Form, Input, InputNumber, Select, DatePicker } from "antd";
import dayjs from "dayjs";

export default function AdminPaymentCreate({ open, loading, bookings = [], onCancel, onSubmit }) {
  const [form] = Form.useForm();

  // Reset form về trạng thái ban đầu mỗi khi đóng modal
  const handleCancel = () => {
    form.resetFields(); 
    onCancel();
  };

  return (
    <Modal
      title="Add New Payment"
      open={open}
      confirmLoading={loading}
      onOk={() => form.submit()}
      onCancel={handleCancel} // Sử dụng hàm handleCancel đã reset form
      destroyOnClose // Xóa sạch component khi đóng
      okText="Create"
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={(v) => {
          v.paymentDate = v.paymentDate.format("YYYY-MM-DDTHH:mm:ss");
          onSubmit(v);
          form.resetFields(); // Reset sau khi submit thành công
        }}
        // Đảm bảo các giá trị mặc định được định nghĩa rõ ràng
        initialValues={{ 
          paymentDate: dayjs(), 
          status: "PENDING",
          amount: undefined,
          bookingId: undefined,
          paymentMethod: ""
        }}
      >
        <Form.Item label="Booking" name="bookingId" rules={[{ required: true, message: 'Please select booking' }]}>
          <Select showSearch placeholder="Select booking ID">
            {bookings.map(b => (
              <Select.Option key={b.id} value={b.id}>Booking #{b.id} - {b.user?.fullName}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
          <InputNumber 
            className="w-full" 
            addonBefore="$" 
            placeholder="0"
            formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={val => val.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item label="Payment Method" name="paymentMethod" rules={[{ required: true }]}>
          <Input placeholder="e.g. Credit Card, Cash" />
        </Form.Item>

        <Form.Item label="Payment Date" name="paymentDate" rules={[{ required: true }]}>
          <DatePicker showTime className="w-full" format="MM/DD/YYYY HH:mm" />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="PENDING">Pending</Select.Option>
            <Select.Option value="COMPLETED">Completed</Select.Option>
            <Select.Option value="FAILED">Failed</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}