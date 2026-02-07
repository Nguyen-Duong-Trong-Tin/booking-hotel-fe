import { Button, Layout, Menu, Space, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearTokens } from "../../../apis/tokenStorage";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const getSelectedKey = (pathname) => {
  if (pathname.startsWith("/admin/categories")) {
    return "categories";
  }

  return "dashboard";
};

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey = getSelectedKey(location.pathname);

  const handleLogout = () => {
    clearTokens();
    navigate("/admin/login", { replace: true });
  };

  return (
    <Layout className="min-h-screen">
      <Sider width={220} className="bg-slate-950">
        <div className="px-4 py-5">
          <Title level={4} className="!text-white !mb-0">
            Booking Hotel
          </Title>
          <Text className="text-slate-300">Admin Console</Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: "dashboard",
              label: <Link to="/admin">Dashboard</Link>
            },
            {
              key: "categories",
              label: <Link to="/admin/categories">Categories</Link>
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header className="bg-white shadow-sm px-6">
          <Space className="w-full justify-between">
            <Title level={4} className="!mb-0">
              Admin
            </Title>
            <Space>
              <Text type="secondary">Secure management area</Text>
              <Button onClick={handleLogout}>Logout</Button>
            </Space>
          </Space>
        </Header>
        <Content className="px-6 py-8">{children}</Content>
        <Footer className="text-center text-slate-500">
          Booking Hotel Admin Dashboard
        </Footer>
      </Layout>
    </Layout>
  );
}
