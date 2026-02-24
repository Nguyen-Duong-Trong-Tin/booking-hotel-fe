import { Button, Layout, Menu, Space, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearTokens } from "../../../apis/tokenStorage";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const getSelectedKey = (pathname) => {
  if (pathname.startsWith("/admin/categories")) {
    return "categories";
  }

  if (pathname.startsWith("/admin/users")) {
    return "users";
  }

  if (pathname.startsWith("/admin/roles")) {
    return "roles";
  }

  if (pathname.startsWith("/admin/bookings")) {
    return "bookings";
  }

  if (pathname.startsWith("/admin/payments")) {
    return "payments";
  }

  if (pathname.startsWith("/admin/rooms")) {
    return "rooms";
  }

  if (pathname.startsWith("/admin/amenities")) {
    return "amenities";
  }

  if (pathname.startsWith("/admin/room-amenities")) {
    return "room-amenities";
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
              key: "roles",
              label: <Link to="/admin/roles">Roles</Link>
            },
               
            {
              key: "users",
              label: <Link to="/admin/users">Users</Link>
            },

            {
              key: "bookings",
              label: <Link to="/admin/bookings">Bookings</Link>
            },

            {
              key: "payments",
              label: <Link to="/admin/payments">Payments</Link>
            },

            {
              key: "categories",
              label: <Link to="/admin/categories">Categories</Link>
            },
            
            {
              key: "rooms",
              label: <Link to="/admin/rooms">Rooms</Link>
            },

            {
              key: "amenities",
              label: <Link to="/admin/amenities">Amenities</Link>
            },

            {
              key: "room-amenities",
              label: <Link to="/admin/room-amenities">Room Amenities</Link>
            },

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
