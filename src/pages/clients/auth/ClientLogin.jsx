import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { loginClient } from "../../../apis/authApi";
import { setTokens } from "../../../apis/tokenStorage";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";
import { decodeJwtPayload } from "../../../utils/auth";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function ClientLogin() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = searchParams.get("accessToken") || hashParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken") || hashParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      return;
    }

    const payload = decodeJwtPayload(accessToken);
    if (!payload) {
      messageApi.error("Google login failed");
      return;
    }

    setTokens({ accessToken, refreshToken, remember: true });
    navigate("/complete-profile", { replace: true });
  }, [messageApi, navigate]);

  const handleFinish = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await loginClient({
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
      navigate("/");
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

  const handleGoogleLogin = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
    window.location.href = `${apiBase}/v1/auth/google/authorize`;
  };

  return (
    <Layout className="min-h-screen bg-slate-50 text-slate-900">
      {contextHolder}
      <ClientHeader />
      <Content className="relative flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="rounded-3xl border border-slate-200 shadow-lg">
            <div className="text-center mb-6">
              <Title level={3} className="!mb-1 text-slate-900">
                Client Login
              </Title>
              <Text className="text-slate-600">
                Sign in to complete your booking
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
                <Input placeholder="you@example.com" />
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
                className="bg-cyan-600 border-none"
              >
                Sign in
              </Button>
              <div className="mt-4 flex justify-center">
                <Button onClick={handleGoogleLogin} block>
                  Sign in with Google
                </Button>
              </div>
            </Form>
            <div className="mt-6 text-center">
              <Text className="text-slate-600">
                Use your client account to sign in. New here?{" "}
                <Link to="/register">Create an account</Link>
              </Text>
            </div>
          </Card>
        </div>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
