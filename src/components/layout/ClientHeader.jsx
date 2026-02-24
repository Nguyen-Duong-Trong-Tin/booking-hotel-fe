import { Button, Layout, Typography } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const headerLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Rooms", to: "/rooms" },
  { label: "Deals", href: "#deals" },
  { label: "About", href: "#about" }
];

export default function ClientHeader() {
  return (
    <Header className="bg-white border-b border-slate-200 flex items-center">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Title level={3} className="!mb-0">
            Booking Hotel
          </Title>
          <nav className="hidden md:flex items-center gap-6">
            {headerLinks.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-slate-600 hover:text-slate-900 font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-slate-600 hover:text-slate-900 font-medium"
                >
                  {item.label}
                </a>
              )
            )}
          </nav>
        </div>
        <Link to="/admin/login">
          <Button type="primary">Admin Login</Button>
        </Link>
      </div>
    </Header>
  );
}
