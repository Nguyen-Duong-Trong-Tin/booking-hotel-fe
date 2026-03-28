import { useEffect, useState } from "react";
import { Button, Layout, Menu, Space, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUsers } from "../../../apis/userApi";
import { clearTokens, getAccessToken } from "../../../apis/tokenStorage";
import { decodeJwtPayload } from "../../../utils/auth";

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
  const accessToken = getAccessToken();
  const payload = decodeJwtPayload(accessToken);
  const userEmail = payload?.sub || "";
  const role = payload?.role;
  const normalizedRole = typeof role === "string" ? role.toUpperCase() : "";
  const isEmployee = normalizedRole === "EMPLOYEE" || normalizedRole === "ROLE_EMPLOYEE";
  const [fullName, setFullName] = useState("");
  const menuItems = [
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
    }
  ];

  const filteredMenuItems = isEmployee
    ? menuItems.filter((item) => item.key !== "roles" && item.key !== "users")
    : menuItems;

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      if (!accessToken) {
        if (isActive) {
          setFullName("");
        }
        return;
      }

      if (!userEmail) {
        if (isActive) {
          setFullName("User");
        }
        return;
      }

      try {
        const response = await getUsers({ page: 0, size: 1, email: userEmail });
        const items = response?.data?.items || response?.items || [];
        const user = items[0];
        if (isActive) {
          setFullName(user?.fullName || userEmail || "User");
        }
      } catch (error) {
        if (isActive) {
          setFullName(userEmail || "User");
        }
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [accessToken, userEmail]);

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
          items={filteredMenuItems}
        />
      </Sider>
      <Layout>
        <Header className="bg-white shadow-sm px-6">
          <Space className="w-full justify-between">
            <Title level={4} className="!mb-0">
              Admin
            </Title>
            <Space>
              <Text type="secondary">{fullName || "User"}</Text>
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
