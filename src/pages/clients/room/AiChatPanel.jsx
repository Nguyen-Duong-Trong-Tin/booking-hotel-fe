import { Alert, Button, Input, Space, Typography } from "antd";
import { formatPrice } from "./utils";

const { Text } = Typography;

export default function AiChatPanel({
  message,
  onMessageChange,
  onSearch,
  onClear,
  loading,
  error,
  answer,
  suggestions,
  canClear
}) {
  return (
    <div>
      <Space direction="vertical" className="w-full" size={12}>
        <Input.TextArea
          rows={4}
          placeholder="Example: A quiet room for 2 people, under $120, with city view"
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
        />
        <Space>
          <Button type="primary" onClick={onSearch} loading={loading} className="bg-cyan-600 border-none">
            Find rooms
          </Button>
          <Button onClick={onClear} disabled={!canClear}>
            Clear filter
          </Button>
        </Space>
        {error && <Alert type="error" message={error} showIcon />}
      </Space>

      {(answer || suggestions.length > 0) && (
        <div className="mt-4">
          {answer && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <Text>{answer}</Text>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="mt-4 space-y-3">
              {suggestions.map((item) => (
                <div key={`${item.roomId}-${item.roomNumber}`} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <Text className="font-semibold">Room {item.roomNumber || item.roomId}</Text>
                    <Text type="secondary">{formatPrice(item.price)}</Text>
                  </div>
                  <Text type="secondary">
                    {item.category || "General"} · Capacity {item.capacity || "N/A"}
                  </Text>
                  {item.reason && (
                    <div className="mt-2">
                      <Text>{item.reason}</Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
