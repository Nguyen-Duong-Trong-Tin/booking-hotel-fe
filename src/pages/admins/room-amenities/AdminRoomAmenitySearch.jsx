import { Form, Button, Space, Select } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

export default function AdminRoomAmenitySearch({ rooms, amenities, onSearch }) {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onSearch({ roomId: undefined, amenityId: undefined });
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onSearch}
      className="flex flex-wrap gap-4"
    >
      <Form.Item name="roomId">
        <Select 
          placeholder="Filter by Room" 
          style={{ width: 180 }} 
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {rooms.map(r => (
            <Select.Option key={r.id} value={r.id}>Room {r.roomNumber}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="amenityId">
        <Select 
          placeholder="Filter by Amenity" 
          style={{ width: 180 }} 
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {amenities.map(a => (
            <Select.Option key={a.id} value={a.id}>{a.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
          <Button icon={<ReloadOutlined Boris />} onClick={handleReset}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}