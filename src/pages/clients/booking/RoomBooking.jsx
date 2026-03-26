import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Layout,
  message,
  Select,
  Space,
  Spin,
  Typography
} from "antd";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";
import { createBooking } from "../../../apis/bookingApi";
import { getRoomById } from "../../../apis/roomApi";
import { getUsers } from "../../../apis/userApi";
import { getAccessToken } from "../../../apis/tokenStorage";
import { decodeJwtPayload } from "../../../utils/auth";
import { toast } from "react-toastify";

const { Content } = Layout;
const { Title, Text } = Typography;

const PAYMENT_METHODS = [
  { label: "Pay in cash", value: "CASH" },
  { label: "Pay online", value: "ONLINE" }
];

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return 0;
  }
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default function RoomBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const ensureLoginAndLoad = async () => {
      try {
        setLoading(true);
        const accessToken = getAccessToken();
        if (!accessToken) {
          toast.info("Please sign in to continue booking.", {
            toastId: "login-required"
          });
          navigate("/login", { replace: true, state: { from: location.pathname } });
          return;
        }

        const payload = decodeJwtPayload(accessToken);
        const email = payload?.sub;
        if (!email) {
          toast.error("Session is invalid. Please sign in again.", {
            toastId: "login-invalid"
          });
          navigate("/login", { replace: true, state: { from: location.pathname } });
          return;
        }

        const userResponse = await getUsers({ page: 0, size: 1, email });
        const userItems = userResponse?.data?.items || userResponse?.items || [];
        const currentUser = userItems[0];
        if (!currentUser?.id) {
          toast.error("User account not found. Please sign in again.", {
            toastId: "login-user-missing"
          });
          navigate("/login", { replace: true, state: { from: location.pathname } });
          return;
        }

        setUserId(currentUser.id);
        form.setFieldsValue({ userId: currentUser.id });

        const response = await getRoomById(id);
        const roomData = response?.data || response;
        setRoom(roomData);
        form.setFieldsValue({ roomId: roomData?.id ?? id });
      } catch (error) {
        message.error("Unable to load room details.");
        navigate("/rooms");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      ensureLoginAndLoad();
    }
  }, [id, navigate, form, location.pathname]);

  const pricePerNight = useMemo(() => toNumber(room?.price), [room]);

  const handleValuesChange = (_, allValues) => {
    const nights = getNights(allValues.checkIn, allValues.checkOut);
    const totalPrice = nights * pricePerNight;
    form.setFieldsValue({ totalPrice });
  };

  const handleSubmit = async (values) => {
    if (!userId) {
      toast.info("Please sign in to continue booking.", {
        toastId: "login-required"
      });
      navigate("/login", { replace: true, state: { from: location.pathname } });
      return;
    }

    try {
      if (values.paymentMethod === "ONLINE") {
        navigate("/payments/online", {
          state: {
            roomId: values.roomId,
            roomNumber: room?.roomNumber,
            roomImageUrl:
              room?.roomImages?.find((img) => img?.isPresentative)?.url ||
              room?.roomImages?.[0]?.url ||
              "",
            latitude: room?.latitude ?? null,
            longitude: room?.longitude ?? null,
            totalPrice: values.totalPrice,
            checkIn: values.checkIn,
            checkOut: values.checkOut,
            userId
          }
        });
        return;
      }

      const payload = {
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        totalPrice: values.totalPrice,
        status: "PENDING",
        paymentMethod: values.paymentMethod,
        userId,
        roomId: values.roomId
      };

      setSubmitting(true);
      const response = await createBooking(payload);
      if (response?.status !== 200 && response?.status !== 201) {
        const errorText = response?.errors?.join(", ") || response?.message || "Booking failed.";
        message.error(errorText);
        return;
      }
      message.success("Booking created successfully.");
      navigate(`/rooms/${id}`);
    } catch (error) {
      const errorText =
        error?.response?.data?.errors?.join(", ") ||
        error?.response?.data?.message ||
        error?.message ||
        "Booking failed.";
      message.error(errorText);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spin size="large" tip="Loading booking form..." />
      </div>
    );
  }

  const nights = getNights(form.getFieldValue("checkIn"), form.getFieldValue("checkOut"));
  const mainImage =
    room?.roomImages?.find((img) => img?.isPresentative)?.url ||
    room?.roomImages?.[0]?.url ||
    "https://via.placeholder.com/600x400?text=No+Image";
  const previewImages = (room?.roomImages || [])
    .map((img) => img?.url)
    .filter(Boolean);

  return (
    <Layout className="min-h-screen bg-slate-50 text-slate-900">
      <ClientHeader />
      <Content className="max-w-5xl mx-auto w-full px-4 py-10">
        <Title level={2} className="!mb-2 text-slate-900">
          Book Room {room?.roomNumber}
        </Title>
        <Text className="text-slate-600">Fill out the booking details below.</Text>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="rounded-3xl border border-slate-200 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onValuesChange={handleValuesChange}
              initialValues={{
                paymentMethod: "CASH",
                roomId: id,
                totalPrice: 0
              }}
            >
              <Form.Item name="userId" hidden>
                <Input />
              </Form.Item>

              <Form.Item label="Room ID" name="roomId">
                <Input readOnly />
              </Form.Item>

              <Form.Item
                label="Check-in"
                name="checkIn"
                rules={[{ required: true, message: "Check-in date is required" }]}
              >
                <Input type="date" />
              </Form.Item>

              <Form.Item
                label="Check-out"
                name="checkOut"
                rules={[{ required: true, message: "Check-out date is required" }]}
              >
                <Input type="date" />
              </Form.Item>

              <Form.Item
                label="Payment method"
                name="paymentMethod"
                rules={[{ required: true, message: "Payment method is required" }]}
              >
                <Select options={PAYMENT_METHODS} />
              </Form.Item>

              <Form.Item
                label="Total Price"
                name="totalPrice"
                rules={[{ required: true, message: "Total price is required" }]}
              >
                <InputNumber className="w-full" min={0} readOnly />
              </Form.Item>

              <Space className="w-full" direction="vertical" size="small">
                <Text className="text-slate-500">
                  {nights > 0
                    ? `${nights} night(s) x ${pricePerNight.toLocaleString()} = ${(
                        nights * pricePerNight
                      ).toLocaleString()}`
                    : "Select check-in and check-out to calculate total price."}
                </Text>
              </Space>

              <Divider />

              <Space className="w-full" size="middle">
                <Button onClick={() => navigate(`/rooms/${id}`)}>Back</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  className="bg-cyan-600 border-none"
                >
                  Confirm Booking
                </Button>
              </Space>
            </Form>
          </Card>

          <Card className="rounded-3xl border border-slate-200 shadow-sm">
            <Space direction="vertical" size="middle" className="w-full">
              <div className="overflow-hidden rounded-xl bg-slate-100">
                <Image.PreviewGroup items={previewImages.length ? previewImages : [mainImage]}>
                  <Image
                    src={mainImage}
                    alt={`Room ${room?.roomNumber || ""}`}
                    className="h-48 w-full object-cover"
                    preview={{ mask: "View gallery" }}
                  />
                </Image.PreviewGroup>
              </div>
              <div>
                <Text type="secondary">Room</Text>
                <Title level={4} className="!mb-0">
                  Room {room?.roomNumber}
                </Title>
              </div>
              <div>
                <Text type="secondary">Category</Text>
                <div className="font-semibold">{room?.category?.name || "General"}</div>
              </div>
              <div>
                <Text type="secondary">Price per night</Text>
                <div className="text-green-600 font-semibold">
                  {pricePerNight.toLocaleString()}
                </div>
              </div>
            </Space>
          </Card>
        </div>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
