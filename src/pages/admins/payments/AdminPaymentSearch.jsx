import { Form, Row, Col, Input, Select, DatePicker, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

export default function AdminPaymentSearch({ onSearch, onReset }) {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSearch} className="bg-white">
      <Row gutter={[16, 0]} align="bottom"> {/* Gutter 0 cho bottom để không đẩy hàng nút xuống */}
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Payment Method" name="paymentMethod" className="mb-0">
            <Input placeholder="Method..." allowClear />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={5}>
          <Form.Item label="Status" name="status" className="mb-0">
            <Select placeholder="Status" allowClear>
              <Select.Option value="PENDING">Pending</Select.Option>
              <Select.Option value="COMPLETED">Completed</Select.Option>
              <Select.Option value="FAILED">Failed</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={5}>
          <Form.Item label="Payment Date" name="paymentDate" className="mb-0">
            <DatePicker className="w-full" format="MM/DD/YYYY" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item className="mb-0"> {/* Form Item trống label để nút đẩy lên ngang hàng input */}
            <Space size="middle">
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                htmlType="submit"
                style={{ backgroundColor: '#1890ff' }}
              >
                Search
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}