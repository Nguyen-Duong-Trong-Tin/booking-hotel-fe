import { Form, Input, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

export default function AdminAmenitySearch({ filters, onSearch, onReset }) {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="inline" onFinish={onSearch} initialValues={filters}>
      <Form.Item name="name">
        <Input placeholder="Search by name..." prefix={<SearchOutlined />} allowClear />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">Search</Button>
          <Button icon={<ReloadOutlined />} onClick={() => { form.resetFields(); onReset(); }}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}