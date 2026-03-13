import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  Typography,
  message
} from "antd";
import { registerClient } from "../../../apis/authApi";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function ClientRegister() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await registerClient({
        fullName: values.fullName?.trim(),
        email: values.email?.trim(),
        phone: values.phone?.trim(),
        password: values.password
      });

      if (response?.status !== 200 && response?.status !== 201) {
        messageApi.error(response?.message || "Registration failed");
        return;
      }

      messageApi.success("Registration successful. Please sign in.");
      navigate("/login");
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      const apiMessage = error?.response?.data?.message;

      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        messageApi.error(apiErrors[0]);
      } else {
        messageApi.error(apiMessage || "Registration failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <ClientHeader />
      <Content className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <div className="text-center mb-6">
              <Title level={3} className="!mb-1">
                Create Account
              </Title>
              <Text type="secondary">
                Join Booking Hotel to complete your booking
              </Text>
            </div>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                label="Full name"
                name="fullName"
                rules={[{ required: true, message: "Please enter your full name" }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input placeholder="you@example.com" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Please enter your phone" }]}
              >
                <Input placeholder="0901234567" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" }
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isSubmitting}
              >
                Create account
              </Button>
            </Form>
            <div className="mt-6 text-center">
              <Text type="secondary">
                Already have an account? <Link to="/login">Sign in</Link>
              </Text>
            </div>
          </Card>
        </div>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
