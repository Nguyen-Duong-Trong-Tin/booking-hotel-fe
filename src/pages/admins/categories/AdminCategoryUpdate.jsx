import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

export default function AdminCategoryUpdate({
  open,
  loading,
  category,
  onCancel,
  onSubmit
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description
      });
    }
  }, [open, category, form]);

  return (
    <Modal
      title="Edit category"
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
          <Input placeholder="Category name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Short description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
