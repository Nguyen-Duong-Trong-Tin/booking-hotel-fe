import { Card, Layout, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { chatRooms } from "../../../apis/aiApi";
import { getRooms } from "../../../apis/roomApi";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";
import AiChatPanel from "./AiChatPanel";
import RoomsByCategory from "./RoomsByCategory";

const { Content } = Layout;
const { Title, Text } = Typography;
const DEFAULT_PAGE_SIZE = 50;
const MAX_AI_LIMIT = 200;

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState("");
  const [message, setMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [aiError, setAiError] = useState("");

  const filteredRooms = useMemo(() => {
    const ids = new Set((suggestions || []).map((item) => item?.roomId).filter(Boolean));
    if (ids.size === 0) {
      return rooms;
    }
    return rooms.filter((room) => ids.has(room.id));
  }, [rooms, suggestions]);

  useEffect(() => {
    const fetchRooms = async () => {
      setRoomsLoading(true);
      setRoomsError("");

      try {
        let page = 0;
        let totalPages = 1;
        const collected = [];

        while (page < totalPages) {
          const response = await getRooms({ page, size: DEFAULT_PAGE_SIZE });
          if (response?.status !== 200) {
            const errorText = response?.errors?.join(", ") || response?.message || "Failed to load rooms";
            setRoomsError(errorText);
            break;
          }

          const data = response?.data || {};
          const items = data?.items || [];
          collected.push(...items);

          totalPages = data?.totalPages || 1;
          page += 1;
        }

        setRooms(collected);
      } catch (err) {
        const errorText =
          err?.response?.data?.errors?.join(", ") ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load rooms";
        setRoomsError(errorText);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSearch = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      setAiError("Please enter a request for the AI assistant.");
      return;
    }

    setAiLoading(true);
    setAiError("");

    try {
      const limit = Math.min(rooms.length || DEFAULT_PAGE_SIZE, MAX_AI_LIMIT);
      const response = await chatRooms({ message: trimmed, limit });

      if (response?.status !== 200) {
        const errorText = response?.errors?.join(", ") || response?.message || "AI request failed";
        setAnswer("");
        setSuggestions([]);
        setAiError(errorText);
        return;
      }

      setAnswer(response?.data?.answer || "");
      setSuggestions(response?.data?.suggestions || []);
    } catch (err) {
      const errorText =
        err?.response?.data?.errors?.join(", ") ||
        err?.response?.data?.message ||
        err?.message ||
        "AI request failed";
      setAnswer("");
      setSuggestions([]);
      setAiError(errorText);
    } finally {
      setAiLoading(false);
    }
  };

  const clearFilter = () => {
    setSuggestions([]);
    setAnswer("");
    setAiError("");
  };

  return (
    <Layout className="min-h-screen bg-slate-50 text-slate-900">
      <ClientHeader />
      <Content className="px-4 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <Title level={2} className="!mb-2 text-slate-900">
            Rooms
          </Title>
          <Text className="text-slate-600">Chat with the assistant to filter the room list below.</Text>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <Card className="rounded-3xl border border-slate-200 shadow-sm" title="Available rooms">
              <RoomsByCategory rooms={filteredRooms} loading={roomsLoading} error={roomsError} />
            </Card>

            <Card className="rounded-3xl border border-slate-200 shadow-sm" title="AI room search">
              <AiChatPanel
                message={message}
                onMessageChange={setMessage}
                onSearch={handleSearch}
                onClear={clearFilter}
                loading={aiLoading}
                error={aiError}
                answer={answer}
                suggestions={suggestions}
                canClear={Boolean(answer || suggestions.length > 0) && !aiLoading}
              />
            </Card>
          </div>
        </div>
      </Content>
      <ClientFooter />
    </Layout>
  );
}
