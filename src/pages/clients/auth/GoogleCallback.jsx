import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Spin, message } from "antd";
import { setTokens } from "../../../apis/tokenStorage";

const { Content } = Layout;

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = searchParams.get("accessToken") || hashParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken") || hashParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      const error = searchParams.get("error") || hashParams.get("error");
      messageApi.error(error ? `Google login failed: ${error}` : "Google login failed");
      navigate("/login", { replace: true });
      return;
    }

    setTokens({ accessToken, refreshToken, remember: true });

    navigate("/complete-profile", { replace: true });
  }, [messageApi, navigate]);

  return (
    <Layout className="min-h-screen bg-slate-50">
      {contextHolder}
      <Content className="flex items-center justify-center">
        <Spin size="large" tip="Signing you in..." />
      </Content>
    </Layout>
  );
}
