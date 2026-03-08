import { Card, Image, Tag, Typography } from "antd";
import { formatPrice, getStatusColor } from "./utils";

const { Title, Text } = Typography;

export default function RoomCard({ room }) {
  const presentative = (room.roomImages || []).find((img) => img.isPresentative);
  const imageUrl = presentative?.url || room.roomImages?.[0]?.url;

  return (
    <Card className="shadow-sm" size="small">
      <div className="flex gap-4">
        <div className="w-24">
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={96}
              height={96}
              style={{ objectFit: "cover", borderRadius: 8 }}
              preview={false}
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
              No image
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <Title level={5} className="!mb-1">
              Room {room.roomNumber}
            </Title>
            {room.status && <Tag color={getStatusColor(room.status)}>{room.status}</Tag>}
          </div>
          <Text type="secondary">
            {room.category?.name || "General"} · Capacity {room.capacity || "N/A"}
          </Text>
          <div className="mt-2">
            <Text className="font-semibold text-green-600">{formatPrice(room.price)}</Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
