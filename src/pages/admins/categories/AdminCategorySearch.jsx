import { Button, Form, Input, Space } from "antd";
import { useEffect } from "react";

export default function AdminCategorySearch({ filters, onSearch, onReset }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(filters);
  }, [filters, form]);

  const handleFinish = (values) => {
    onSearch({
      name: values.name || "",
      description: values.description || ""
    });
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form form={form} layout="inline" onFinish={handleFinish}>
      <Form.Item label="Name" name="name">
        <Input placeholder="Search name" allowClear />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input placeholder="Search description" allowClear />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
