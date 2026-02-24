import { Modal, Form, Input, InputNumber, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function AdminPaymentUpdate({ open, loading, payment, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  // Đổ dữ liệu cũ vào form
  useEffect(() => {
    if (open && payment) {
      form.setFieldsValue({
        bookingId: payment.booking?.id,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        // Chuyển string từ backend về dayjs object
        paymentDate: payment.paymentDate ? dayjs(payment.paymentDate) : null,
      });
    }
  }, [open, payment, form]);

  const handleFinish = (values) => {
    // Kiểm tra an toàn: nếu có ngày thì mới format, không thì để null
    const payload = {
      ...values,
      paymentDate: values.paymentDate ? values.paymentDate.format("YYYY-MM-DDTHH:mm:ss") : null
    };
    onSubmit(payload);
  };

  return (
    <Modal
      title="Update Payment"
      open={open}
      confirmLoading={loading}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      destroyOnClose
      okText="Save Changes"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Booking ID" name="bookingId">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Amount" name="amount" rules={[{ required: true, message: "Please enter amount" }]}>
          <InputNumber 
            className="w-full" 
            addonBefore="$" 
            placeholder="0"
            formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={val => val.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item label="Method" name="paymentMethod" rules={[{ required: true, message: "Please enter method" }]}>
          <Input placeholder="e.g. Credit Card, Cash" />
        </Form.Item>

        {/* BỔ SUNG: Ô nhập ngày tháng bị thiếu dẫn đến lỗi crash */}
        <Form.Item label="Payment Date" name="paymentDate" rules={[{ required: true, message: "Please select date" }]}>
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