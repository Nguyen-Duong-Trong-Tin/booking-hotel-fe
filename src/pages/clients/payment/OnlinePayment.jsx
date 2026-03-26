import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Divider, Layout, Space, Typography, message } from "antd";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";
import { createBooking } from "../../../apis/bookingApi";

const { Content } = Layout;
const { Title, Text } = Typography;

const VIETQR_BANK_CODE = "BIDV";
const VIETQR_ACCOUNT_NUMBER = "7411169464";
const VIETQR_ACCOUNT_NAME = "Nguyen Duong Trong Tin";

const buildVietQrUrl = ({ amount, addInfo }) => {
  const params = new URLSearchParams({
    amount: Math.max(0, Number(amount || 0)).toString(),
    addInfo: addInfo || "",
    accountName: VIETQR_ACCOUNT_NAME
  });
  return `https://img.vietqr.io/image/${VIETQR_BANK_CODE}-${VIETQR_ACCOUNT_NUMBER}-compact.png?${params.toString()}`;
};

export default function OnlinePayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentInfo = location.state || {};
  const totalPrice = Number(paymentInfo.totalPrice || 0);
  const roomId = paymentInfo.roomId;
  const roomImageUrl = paymentInfo.roomImageUrl || "";
  const latitude = paymentInfo.latitude;
  const longitude = paymentInfo.longitude;
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);

  const qrUrl = useMemo(() => {
    return buildVietQrUrl({
      amount: totalPrice,
      addInfo: roomId ? `Room ${roomId}` : "Booking"
    });
  }, [totalPrice, roomId]);

  useEffect(() => {
    if (!roomId || !paymentInfo?.userId) {
      return;
    }

    setProcessing(true);
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(async () => {
      try {
        const payload = {
          checkIn: paymentInfo.checkIn,
          checkOut: paymentInfo.checkOut,
          totalPrice: totalPrice,
          status: "CONFIRMED",
          paymentMethod: "ONLINE",
          userId: paymentInfo.userId,
          roomId: roomId
        };

        const response = await createBooking(payload);
        if (response?.status !== 200 && response?.status !== 201) {
          const errorText = response?.errors?.join(", ") || response?.message || "Booking failed.";
          message.error(errorText);
          return;
        }

        setCompleted(true);
        message.success("Payment received. Booking confirmed.");
        navigate(`/rooms/${roomId}`);
      } catch (error) {
        const errorText =
          error?.response?.data?.errors?.join(", ") ||
          error?.response?.data?.message ||
          error?.message ||
          "Booking failed.";
        message.error(errorText);
      } finally {
        setProcessing(false);
      }
    }, 30000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, [navigate, paymentInfo, roomId, totalPrice]);

  return (
    <Layout className="min-h-screen bg-slate-50 text-slate-900">
      <ClientHeader />
      <Content className="max-w-3xl mx-auto w-full px-4 py-10">
        <Title level={2} className="!mb-2 text-slate-900">
          Online Payment
        </Title>
        <Text className="text-slate-600">
          Review the payment details and continue to pay online.
        </Text>

        <Card className="mt-6 rounded-3xl border border-slate-200 shadow-sm">
          <Space direction="vertical" size="middle" className="w-full">
            {roomImageUrl ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <img
                  src={roomImageUrl}
                  alt={paymentInfo.roomNumber ? `Room ${paymentInfo.roomNumber}` : "Room"}
                  className="h-56 w-full object-cover"
                />
              </div>
            ) : null}
            <div>
              <Text className="text-slate-500">Room</Text>
              <div className="font-semibold">
                {paymentInfo.roomNumber ? `Room ${paymentInfo.roomNumber}` : "Room"}
              </div>
            </div>
            {(latitude !== null && latitude !== undefined) ||
            (longitude !== null && longitude !== undefined) ? (
              <div>
                <Text className="text-slate-500">Location</Text>
                <div className="font-semibold">
                  {latitude ?? "N/A"}, {longitude ?? "N/A"}
                </div>
              </div>
            ) : null}
            <div>
              <Text className="text-slate-500">Total price</Text>
              <div className="text-lg font-semibold text-cyan-700">
                {totalPrice.toLocaleString()}
              </div>
            </div>
            <Divider />
            <Space>
              <Button onClick={() => navigate(roomId ? `/rooms/${roomId}` : "/rooms")}>
                Back to room
              </Button>
            </Space>
            <div className="pt-4">
              <Text className="text-slate-500">Scan VietQR to pay</Text>
              <div className="mt-3 flex justify-center rounded-2xl border border-slate-200 bg-white p-4">
                <img
                  src={qrUrl}
                  alt="VietQR"
                  className="h-64 w-64"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Bank: {VIETQR_BANK_CODE} | Account: {VIETQR_ACCOUNT_NUMBER}
              </div>
              <div className="mt-3 text-sm text-slate-600">
                {completed
                  ? "Booking confirmed. Redirecting..."
                  : `Simulating payment. Confirming in ${secondsLeft}s.`}
              </div>
            </div>
          </Space>
        </Card>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
