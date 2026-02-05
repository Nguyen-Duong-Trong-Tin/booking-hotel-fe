import { Button, Card, Layout, Typography } from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  return (
    <Layout className="min-h-screen">
      <Header className="bg-white border-b border-slate-200 flex items-center">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-6">
          <Title level={3} className="!mb-0">
            Booking Hotel
          </Title>
          <Link to="/admin/login">
            <Button type="primary">Admin Login</Button>
          </Link>
        </div>
      </Header>
      <Content className="px-4 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Title>Find your next stay</Title>
              <Text type="secondary" className="block mb-6">
                Browse hand-picked hotels and resorts with flexible booking.
              </Text>
              <div className="flex flex-wrap gap-3">
                <Button type="primary" size="large">
                  Explore Hotels
                </Button>
                <Button size="large">View Deals</Button>
              </div>
            </div>
            <Card className="shadow-md">
              <Title level={4}>Popular destinations</Title>
              <ul className="mt-4 space-y-3">
                {[
                  "Da Nang · Beachfront",
                  "Hoi An · Boutique stays",
                  "Nha Trang · Ocean view",
                  "Ha Long · Family resort"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <Text>{item}</Text>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Content>
      <Footer className="text-center text-slate-500">
        © 2026 Booking Hotel. All rights reserved.
      </Footer>
    </Layout>
  );
}
