import { Button, Form, Input, Space } from "antd";
import { useEffect } from "react";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

export default function AdminUserSearch({ filters, onSearch, onReset }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(filters);
  }, [filters, form]);

  const handleFinish = (values) => {
    onSearch({
      fullName: values.fullName?.trim() || "",
      email: values.email?.trim() || "",
      phone: values.phone?.trim() || "",
      roleName: values.roleName?.trim() || ""
    });
  };

  return (
    <Form form={form} layout="inline" onFinish={handleFinish} style={{ gap: '16px' }}>
      <Form.Item label="Name" name="fullName"><Input placeholder="Name" allowClear /></Form.Item>
      <Form.Item label="Email" name="email"><Input placeholder="Email" allowClear /></Form.Item>
      <Form.Item label="Role" name="roleName"><Input placeholder="Role name" allowClear /></Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Search</Button>
          <Button onClick={() => { form.resetFields(); onReset(); }} icon={<ReloadOutlined />}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}