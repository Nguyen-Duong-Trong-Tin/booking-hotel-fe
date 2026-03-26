import { useState } from "react";
import { Button, Card, Form, Input, Layout, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";
import { updateMyProfile } from "../../../apis/userApi";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function CompleteProfile() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const response = await updateMyProfile({
        fullName: values.fullName?.trim() || undefined,
        phone: values.phone?.trim(),
        password: values.password
      });

      if (!response?.data) {
        messageApi.error(response?.message || "Update failed");
        return;
      }

      messageApi.success("Profile updated");
      navigate("/");
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      const apiMessage = error?.response?.data?.message;

      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        messageApi.error(apiErrors[0]);
      } else {
        messageApi.error(apiMessage || "Update failed");
      }
    } finally {
      setLoading(false);
    }
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
                Complete Your Profile
              </Title>
              <Text className="text-slate-600">
                Add the remaining details to continue.
              </Text>
            </div>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                label="Full name"
                name="fullName"
                rules={[{ max: 100, message: "Max 100 characters" }]}
              >
                <Input placeholder="Your full name" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Phone is required" }]}
              >
                <Input placeholder="Phone number" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password placeholder="Create a password" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="bg-cyan-600 border-none"
              >
                Save
              </Button>
            </Form>
          </Card>
        </div>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
