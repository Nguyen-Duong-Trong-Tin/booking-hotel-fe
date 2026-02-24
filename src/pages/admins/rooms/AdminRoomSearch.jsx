import { Form, Input, Button, Space, Select } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

export default function AdminRoomSearch({ onSearch, categories }) {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onSearch({ roomNumber: "", status: "", categoryName: "" });
  };

  return (
    <Form 
      form={form} 
      layout="inline" 
      onFinish={onSearch}
      className="flex flex-wrap gap-y-4"
    >
      <Form.Item name="roomNumber">
        <Input placeholder="Room Number..." prefix={<SearchOutlined />} allowClear />
      </Form.Item>

      <Form.Item name="status">
        <Select placeholder="Status" style={{ width: 150 }} allowClear>
          <Select.Option value="AVAILABLE">Available</Select.Option>
          <Select.Option value="OCCUPIED">Occupied</Select.Option>
          <Select.Option value="MAINTENANCE">Maintenance</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="categoryName">
        <Select placeholder="Category" style={{ width: 180 }} allowClear>
          {categories.map(cat => (
            <Select.Option key={cat.id} value={cat.name}>{cat.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}