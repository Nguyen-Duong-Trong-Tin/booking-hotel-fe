import { Button, Form, Select, Space, DatePicker, Row, Col } from "antd";

export default function AdminBookingSearch({ rooms = [], onSearch }) {
  const [form] = Form.useForm();

  // Ensure rooms is always an array to prevent .map() errors
  const safeRooms = Array.isArray(rooms) ? rooms : [];

  const handleFinish = (values) => {
    // Map form values to BookingFindDto structure
    const searchParams = {
      roomId: values.roomId,
      status: values.status,
      // LocalDate format (YYYY-MM-DD) for Backend
      checkIn: values.dates?.[0]?.format("YYYY-MM-DD"),
      checkOut: values.dates?.[1]?.format("YYYY-MM-DD"),
      userId: values.userId 
    };
    onSearch(searchParams);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({}); // Reload full list on reset
  };

  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={handleFinish}
    >
      <Row gutter={16} align="bottom">
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Select Room" name="roomId">
            <Select placeholder="All Rooms" allowClear style={{ width: '100%' }}>
              {safeRooms.map((r) => (
                <Select.Option key={r.id} value={r.id}>
                  Room {r.roomNumber}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Status" name="status">
            <Select placeholder="All Status" allowClear style={{ width: '100%' }}>
              <Select.Option value="PENDING">Pending</Select.Option>
              <Select.Option value="CONFIRMED">Confirmed</Select.Option>
              <Select.Option value="CANCELLED">Cancelled</Select.Option>
              <Select.Option value="COMPLETED">Completed</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Date Range" name="dates">
            <DatePicker.RangePicker 
              style={{ width: '100%' }} 
              format="MM/DD/YYYY"
              placeholder={['Check-in', 'Check-out']}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={4}>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button onClick={handleReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}