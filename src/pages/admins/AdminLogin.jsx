import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  Typography
} from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function AdminLogin() {
  const [form] = Form.useForm();

  return (
    <Layout className="min-h-screen">
      <Content className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <div className="text-center mb-6">
              <Title level={3} className="!mb-1">
                Admin Login
              </Title>
              <Text type="secondary">
                Booking Hotel management portal
              </Text>
            </div>
            <Form form={form} layout="vertical">
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input placeholder="admin@booking-hotel.com" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>
              <div className="flex items-center justify-between mb-4">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Button type="link" className="p-0">
                  Forgot password?
                </Button>
              </div>
              <Button type="primary" htmlType="submit" block size="large">
                Sign in
              </Button>
            </Form>
            <div className="mt-6 text-center">
              <Text type="secondary">This is a static UI only (no API).</Text>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
