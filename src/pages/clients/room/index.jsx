import { Card, Layout, Typography } from "antd";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Rooms() {
  return (
    <Layout className="min-h-screen">
      <ClientHeader />
      <Content className="px-4 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <Title level={2} className="!mb-2">
            Rooms
          </Title>
          <Text type="secondary">
            This is a placeholder for the rooms listing page.
          </Text>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="shadow-sm">
                <Title level={4}>Room Card {item}</Title>
                <Text type="secondary">Replace with room details later.</Text>
              </Card>
            ))}
          </div>
        </div>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
