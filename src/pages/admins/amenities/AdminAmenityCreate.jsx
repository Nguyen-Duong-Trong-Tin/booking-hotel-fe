import { Form, Input, Modal } from "antd";

export default function AdminAmenityCreate({ open, loading, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  return (
    <Modal
      title="Create New Amenity"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
      okText="Create"
    >
      <Form form={form} layout="vertical" onFinish={(v) => { onSubmit(v); form.resetFields(); }}>
        <Form.Item label="Amenity Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
          <Input placeholder="e.g. Wi-Fi" />
        </Form.Item>
        <Form.Item label="Icon URL" name="iconUrl">
          <Input placeholder="https://example.com/icon.png" />
        </Form.Item>
      </Form>
    </Modal>
  );
}