import { Layout, Typography } from "antd";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";

const { Content } = Layout;
const { Title } = Typography;

export default function Destinations() {
  return (
    <Layout className="min-h-screen bg-white">
      <ClientHeader />
      <Content className="px-4 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <Title level={2} className="!mb-0">
            Destinations
          </Title>
        </div>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
