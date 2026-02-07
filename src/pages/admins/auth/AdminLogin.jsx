import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  Typography,
  message
} from "antd";
import { loginAdmin } from "../../../apis/authApi";
import { setTokens } from "../../../apis/tokenStorage";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function AdminLogin() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await loginAdmin({
        email: values.email?.trim(),
        password: values.password
      });
      const tokenPayload = response?.data;

      if (!tokenPayload?.accessToken || !tokenPayload?.refreshToken) {
        messageApi.error(response?.message || "Login failed");
        return;
      }

      setTokens({
        accessToken: tokenPayload.accessToken,
        refreshToken: tokenPayload.refreshToken,
        remember: Boolean(values.remember)
      });
      messageApi.success("Signed in successfully");
      navigate("/admin");
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      const apiMessage = error?.response?.data?.message;

      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        messageApi.error(apiErrors[0]);
      } else {
        messageApi.error(apiMessage || "Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      {contextHolder}
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
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{ remember: true }}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
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
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isSubmitting}
              >
                Sign in
              </Button>
            </Form>
            <div className="mt-6 text-center">
              <Text type="secondary">Use your admin account to sign in.</Text>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
