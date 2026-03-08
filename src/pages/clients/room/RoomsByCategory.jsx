import { Alert, Empty, Typography } from "antd";
import { useMemo } from "react";
import RoomCard from "./RoomCard";

const { Title, Text } = Typography;

export default function RoomsByCategory({ rooms, loading, error }) {
  const groupedRooms = useMemo(() => {
    const map = new Map();

    (rooms || []).forEach((room) => {
      const categoryName = room?.category?.name || "General";
      if (!map.has(categoryName)) {
        map.set(categoryName, []);
      }
      map.get(categoryName).push(room);
    });

    return Array.from(map.entries());
  }, [rooms]);

  if (error) {
    return <Alert type="error" message={error} showIcon />;
  }

  if (loading && groupedRooms.length === 0) {
    return <Text type="secondary">Loading rooms...</Text>;
  }

  if (!loading && groupedRooms.length === 0) {
    return <Empty description="No rooms found" />;
  }

  return (
    <div className="space-y-6">
      {groupedRooms.map(([categoryName, items]) => (
        <section key={categoryName}>
          <Title level={4} className="!mb-3">
            {categoryName}
          </Title>
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
