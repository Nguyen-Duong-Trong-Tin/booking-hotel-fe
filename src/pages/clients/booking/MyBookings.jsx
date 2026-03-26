import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Empty, Layout, Space, Spin, Tag, Typography, message } from "antd";
import dayjs from "dayjs";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";
import { getBookings } from "../../../apis/bookingApi";
import { getUsers } from "../../../apis/userApi";
import { getAccessToken } from "../../../apis/tokenStorage";
import { decodeJwtPayload } from "../../../utils/auth";

const { Content } = Layout;
const { Title, Text } = Typography;

const STATUS_COLORS = {
  PENDING: "gold",
  CONFIRMED: "green",
  CANCELLED: "red",
  COMPLETED: "blue"
};

const PAGE_SIZE = 12;

export default function MyBookings() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setErrorText("");

      const accessToken = getAccessToken();
      if (!accessToken) {
        message.info("Please sign in to view your bookings.");
        navigate("/login", { replace: true, state: { from: location.pathname } });
        setLoading(false);
        return;
      }

      const payload = decodeJwtPayload(accessToken);
      const email = payload?.sub;
      if (!email) {
        message.error("Session is invalid. Please sign in again.");
        navigate("/login", { replace: true, state: { from: location.pathname } });
        setLoading(false);
        return;
      }

      try {
        const userResponse = await getUsers({ page: 0, size: 1, email });
        const userItems = userResponse?.data?.items || userResponse?.items || [];
        const currentUser = userItems[0];
        if (!currentUser?.id) {
          setErrorText("User account not found.");
          setLoading(false);
          return;
        }

        let page = 0;
        let totalPages = 1;
        const collected = [];

        while (page < totalPages) {
          const response = await getBookings({ page, size: PAGE_SIZE, userId: currentUser.id });
          const spec = response?.data || {};
          const items = spec?.items || spec?.content || [];
          collected.push(...items);

          totalPages = typeof spec?.totalPages === "number" ? spec.totalPages : 1;
          page += 1;
        }

        setBookings(collected);
      } catch (error) {
        const text =
          error?.response?.data?.errors?.join(", ") ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load bookings.";
        setErrorText(text);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [navigate, location.pathname]);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const aTime = new Date(a?.checkIn || 0).getTime();
      const bTime = new Date(b?.checkIn || 0).getTime();
      return bTime - aTime;
    });
  }, [bookings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spin size="large" tip="Loading your bookings..." />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen bg-slate-50 text-slate-900">
      <ClientHeader />
      <Content className="px-4 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <Title level={2} className="!mb-2 text-slate-900">
            My Booked Rooms
          </Title>
          <Text className="text-slate-600">Review the rooms you have booked.</Text>

          {errorText ? (
            <div className="mt-10">
              <Card className="rounded-3xl border border-slate-200 shadow-sm">
                <Text type="danger">{errorText}</Text>
              </Card>
            </div>
          ) : sortedBookings.length === 0 ? (
            <div className="mt-12">
              <Empty description="No bookings yet.">
                <Button
                  type="primary"
                  onClick={() => navigate("/rooms")}
                  className="bg-cyan-600 border-none"
                >
                  Explore Rooms
                </Button>
              </Empty>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {sortedBookings.map((booking) => {
                const room = booking?.room;
                const status = booking?.status || "PENDING";
                const statusColor = STATUS_COLORS[status] || "default";
                const imageUrl =
                  room?.roomImages?.find((img) => img?.isPresentative)?.url ||
                  room?.roomImages?.[0]?.url ||
                  "https://via.placeholder.com/600x400?text=Room";

                return (
                  <Card key={booking?.id} className="rounded-3xl border border-slate-200 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                      <img
                        src={imageUrl}
                        alt={`Room ${room?.roomNumber || ""}`}
                        className="h-40 w-full rounded-xl object-cover"
                      />
                      <Space direction="vertical" size={6} className="w-full">
                        <div className="flex items-center justify-between">
                          <Title level={4} className="!mb-0">
                            Room {room?.roomNumber}
                          </Title>
                          <Tag color={statusColor}>{status}</Tag>
                        </div>
                        <Text className="text-slate-500">
                          {dayjs(booking?.checkIn).format("MMM DD, YYYY")} -
                          {" "}
                          {dayjs(booking?.checkOut).format("MMM DD, YYYY")}
                        </Text>
                        <Text className="text-slate-700">
                          Total: {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0
                          }).format(booking?.totalPrice || 0)}
                        </Text>
                        <div className="pt-2">
                          <Button onClick={() => navigate(`/rooms/${room?.id}`)}>
                            View Room Details
                          </Button>
                        </div>
                      </Space>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
