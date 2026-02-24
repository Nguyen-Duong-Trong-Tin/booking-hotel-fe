import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

export default function AdminRoleUpdate({
  open,
  loading,
  role,
  onCancel,
  onSubmit
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description
      });
    }
  }, [open, role, form]);

  return (
    <Modal
      title="Edit role"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Save"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input placeholder="Role name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Short description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
