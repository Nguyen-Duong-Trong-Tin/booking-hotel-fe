import { Card, Space, Typography, Button } from "antd";
import { Link } from "react-router-dom";
import AdminLayout from "../auth/AdminLayout";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Space direction="vertical" size={24} className="w-full">
        <div>
          <Title level={2} className="!mb-1">
            Admin Dashboard
          </Title>
          <Text type="secondary">Manage the booking hotel system.</Text>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm">
            <Space direction="vertical" size={12} className="w-full">
              <Title level={4} className="!mb-0">
                Categories
              </Title>
              <Text type="secondary">
                Create and manage hotel categories.
              </Text>
              <Link to="/admin/categories">
                <Button type="primary">Go to categories</Button>
              </Link>
            </Space>
          </Card>

          <Card className="shadow-sm">
            <Space direction="vertical" size={12} className="w-full">
              <Title level={4} className="!mb-0">
                Overview
              </Title>
              <Text type="secondary">
                More admin tools will appear here soon.
              </Text>
              <Button disabled>Coming soon</Button>
            </Space>
          </Card>
        </div>
      </Space>
    </AdminLayout>
  );
}
