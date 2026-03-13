import { useEffect, useState } from "react";
import { Button, Layout, Space, Typography } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUsers } from "../../apis/userApi";
import { clearTokens, getAccessToken } from "../../apis/tokenStorage";
import { decodeJwtPayload } from "../../utils/auth";

const { Header } = Layout;
const { Title } = Typography;

const headerLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Rooms", to: "/rooms" }, // Link nội bộ dùng NavLink
  { label: "Deals", href: "#deals" },
  { label: "About", href: "#about" }
];

export default function ClientHeader() {
  const navigate = useNavigate();
  const accessToken = getAccessToken();
  const payload = decodeJwtPayload(accessToken);
  const userEmail = payload?.sub || "";
  const isSignedIn = Boolean(accessToken);
  const [fullName, setFullName] = useState("");

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
    navigate("/", { replace: true });
  };

  return (
    <Header className="bg-white border-b border-slate-200 flex items-center px-0">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="hover:opacity-80 transition-all">
            <Title level={3} className="!mb-0 !text-blue-600 font-black tracking-tighter">
              Booking Hotel
            </Title>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {headerLinks.map((item) => {
              // Kiểm tra nếu là NavLink (Link nội bộ)
              if (item.to) {
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) => 
                      `relative py-2 font-semibold transition-all duration-300 hover:text-blue-600 ${
                        isActive ? "text-blue-600" : "text-slate-500"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {/* Hiệu ứng gạch chân bên dưới khi Active */}
                        <span 
                          className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                            isActive ? "w-full" : "w-0"
                          }`} 
                        />
                      </>
                    )}
                  </NavLink>
                );
              }
              
              // Nếu là Link hash (#) hoặc link ngoài
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-slate-500 hover:text-blue-600 font-semibold transition-all"
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <Space>
          {isSignedIn ? (
            <Space className="rounded-full bg-slate-50 px-3 py-1">
              <span className="text-sm font-semibold text-slate-700">
                {fullName || "User"}
              </span>
              <Button size="small" onClick={handleLogout}>
                Logout
              </Button>
            </Space>
          ) : (
            <Link to="/login">
              <Button
                type="primary"
                className="rounded-full px-6 font-bold bg-blue-600 hover:bg-blue-700 border-none shadow-md shadow-blue-100"
              >
                Sign in
              </Button>
            </Link>
          )}
        </Space>
      </div>
    </Header>
  );
}