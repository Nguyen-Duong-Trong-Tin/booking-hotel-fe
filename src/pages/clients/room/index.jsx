<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from "react";
import { 
  Card, Layout, Typography, Tag, Spin, Button, 
  Row, Col, Empty, message, Image, Space, Select, InputNumber 
} from "antd";
import { 
  UserOutlined, 
  CheckCircleOutlined,
  SearchOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ClientFooter from "../../../components/layout/ClientFooter";
import ClientHeader from "../../../components/layout/ClientHeader";
import { getRooms } from "../../../apis/roomApi";
import { getRoomAmenities } from "../../../apis/roomAmenityApi";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function Rooms() {
  const navigate = useNavigate();
  const [allRooms, setAllRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tempFilters, setTempFilters] = useState({ category: "All", minCapacity: null });
  const [appliedFilters, setAppliedFilters] = useState({ category: "All", minCapacity: null });

  // 1. ĐỊNH NGHĨA THỨ TỰ CHUẨN (PRIORITY)
  const categoryPriority = {
    "Standard": 1,
    "Superior": 2,
    "Deluxe": 3,
    "Suite": 4,
    "Other": 99
  };

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        setLoading(true);
        const response = await getRooms({ page: 0, size: 100 });
        const roomList = (response?.data?.items || []).filter(room => room.status === "AVAILABLE");

        const roomsWithAmenities = await Promise.all(
          roomList.map(async (room) => {
            try {
              const amenityRes = await getRoomAmenities({ roomId: room.id, size: 100 });
              return { 
                ...room, 
                displayAmenities: amenityRes?.data?.items || amenityRes?.items || [] 
              };
            } catch (err) {
              return { ...room, displayAmenities: [] };
            }
          })
        );

        setAllRooms(roomsWithAmenities);
        
        // Sắp xếp danh sách category trong Select theo priority
        const uniqueCats = [...new Set(roomList.map(r => r.category?.name).filter(Boolean))];
        const sortedCatList = ["All", ...uniqueCats.sort((a, b) => 
          (categoryPriority[a] || 50) - (categoryPriority[b] || 50)
        )];
        
        setCategories(sortedCatList);
      } catch (error) {
        message.error("Failed to load room data.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomsData();
  }, []);

  const handleSearch = () => setAppliedFilters({ ...tempFilters });
  const handleReset = () => {
    const defaultFilters = { category: "All", minCapacity: null };
    setTempFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const filteredRooms = allRooms.filter(room => {
    const matchCat = appliedFilters.category === "All" || room.category?.name === appliedFilters.category;
    const matchCap = !appliedFilters.minCapacity || room.capacity >= appliedFilters.minCapacity;
    return matchCat && matchCap;
  });

  // 2. NHÓM PHÒNG VÀ SẮP XẾP NHÓM THEO THỨ TỰ
  const groupedRooms = filteredRooms.reduce((acc, room) => {
    const catName = room.category?.name || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(room);
    return acc;
  }, {});

  // Chuyển object thành array và sort theo priority trước khi map
  const sortedGroupedEntries = Object.entries(groupedRooms).sort(([catA], [catB]) => {
    return (categoryPriority[catA] || 50) - (categoryPriority[catB] || 50);
  });
>>>>>>> 4e36fb56b27a4540b3a1701e7d12cd2ca8551b37

  return (
    <Layout className="min-h-screen bg-slate-50/30">
      <ClientHeader />
<<<<<<< HEAD
      <Content className="px-4 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <Title level={2} className="!mb-2">
            Rooms
          </Title>
          <Text type="secondary">Chat with the assistant to filter the room list below.</Text>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <Card className="shadow-sm" title="Available rooms">
              <RoomsByCategory rooms={filteredRooms} loading={roomsLoading} error={roomsError} />
            </Card>

            <Card className="shadow-sm" title="AI room search">
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
=======
      
      <Content className="px-6 py-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-8 text-center">
            <Title level={2} className="uppercase tracking-widest !mb-2">Our Accommodations</Title>
            <Text type="secondary" className="text-base italic text-slate-400">Explore our rooms and amenities</Text>
>>>>>>> 4e36fb56b27a4540b3a1701e7d12cd2ca8551b37
          </div>

          <div className="flex justify-center mb-12">
            <Card className="w-full shadow-sm border-slate-200 bg-white rounded-xl" styles={{ body: { padding: '24px' } }}>
              <Row gutter={[16, 16]} align="bottom">
                <Col xs={24} sm={10} md={8}>
                  <Text strong className="text-[11px] uppercase text-slate-500 mb-2 block tracking-wider">Category</Text>
                  <Select className="w-full" size="large" value={tempFilters.category} onChange={(val) => setTempFilters({ ...tempFilters, category: val })}>
                    {categories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                  </Select>
                </Col>
                <Col xs={24} sm={7} md={8}>
                  <Text strong className="text-[11px] uppercase text-slate-500 mb-2 block tracking-wider">Min. Capacity</Text>
                  <InputNumber className="w-full" size="large" min={1} placeholder="Guests" value={tempFilters.minCapacity} onChange={(val) => setTempFilters({ ...tempFilters, minCapacity: val })} />
                </Col>
                <Col xs={24} sm={7} md={8}>
                  <div className="flex gap-2 w-full">
                    <Button type="primary" icon={<SearchOutlined />} size="large" onClick={handleSearch} className="flex-1 shadow-md font-semibold">Search</Button>
                    <Button icon={<ReloadOutlined />} size="large" onClick={handleReset} className="border-slate-300 text-slate-500 hover:text-blue-500">Reset</Button>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20"><Spin size="large" tip="Finding rooms..." /></div>
          ) : sortedGroupedEntries.length === 0 ? (
            <Empty description="No rooms match your criteria" />
          ) : (
            // 3. HIỂN THỊ THEO DANH SÁCH ĐÃ SORT
            sortedGroupedEntries.map(([category, items]) => (
              <div key={category} className="mb-16">
                <div className="mb-6 flex items-center justify-between">
                  <Space align="center" size="middle">
                    <Title level={3} className="!mb-0 uppercase tracking-tight text-slate-700">{category}</Title>
                    <Tag color="blue" className="rounded-full border-none px-3 font-semibold m-0">{items.length} Rooms</Tag>
                  </Space>
                  <div className="h-[1px] flex-1 bg-slate-200 ml-8 hidden md:block"></div>
                </div>

                <Row gutter={[24, 32]}>
                  {items.map((room) => {
                    const allImageUrls = (room.roomImages || []).map(img => img.url).filter(Boolean);
                    const presentative = (room.roomImages || []).find((img) => img.isPresentative) || room.roomImages?.[0];
                    
                    const roomAmenitiesList = room.displayAmenities || [];
                    const maxDisplay = 3;

                    return (
                      <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                          hoverable
                          className="h-full border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col rounded-xl overflow-hidden bg-white"
                          styles={{ body: { padding: "16px", display: "flex", flexDirection: "column", flex: 1 } }}
                          cover={
                            <div className="h-48 w-full overflow-hidden bg-gray-100 border-b border-slate-100 relative group">
                              {allImageUrls.length > 0 ? (
                                <Image.PreviewGroup items={allImageUrls}>
                                  <Image
                                    alt={room.roomNumber}
                                    src={presentative?.url || "https://via.placeholder.com/400x250?text=No+Image"}
                                    wrapperClassName="w-full h-full block"
                                    className="w-full h-full object-cover block"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Image.PreviewGroup>
                              ) : (
                                <Image
                                  alt="No image"
                                  src="https://via.placeholder.com/400x250?text=No+Image"
                                  wrapperClassName="w-full h-full block"
                                  className="w-full h-full object-cover block"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  preview={false}
                                />
                              )}
                              {allImageUrls.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded text-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                   {allImageUrls.length} Photos
                                </div>
                              )}
                            </div>
                          }
                        >
                          <div className="flex flex-col flex-1" onClick={() => navigate(`/rooms/${room.id}`)}>
                            <Title level={5} className="!mb-1 truncate text-sm font-bold">Room {room.roomNumber}</Title>
                            <div className="mb-3">
                              <Text className="text-slate-500 text-sm">Price: </Text>
                              <Text className="text-blue-600 font-bold text-base">${room.price?.toLocaleString()}</Text>
                            </div>

                            <div className="mb-4 min-h-[52px]">
                              <div className="flex flex-wrap gap-1">
                                {roomAmenitiesList.length > 0 ? (
                                  <>
                                    {roomAmenitiesList.slice(0, maxDisplay).map((item) => (
                                      <Tag key={item.id} icon={<CheckCircleOutlined style={{ fontSize: '9px' }} />} className="m-0 bg-slate-50 border-slate-200 text-[10px] text-slate-600 flex items-center px-1.5 py-0 rounded">
                                        {item.amenity?.name}
                                      </Tag>
                                    ))}
                                    {roomAmenitiesList.length > maxDisplay && <Text className="text-[10px] text-slate-400 font-medium ml-1">+ {roomAmenitiesList.length - maxDisplay} more</Text>}
                                  </>
                                ) : <Text className="text-[10px] italic text-slate-300">Standard amenities</Text>}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex justify-between items-center mt-auto">
                              <Text type="secondary" className="text-[11px] font-medium"><UserOutlined /> {room.capacity} Guests</Text>
                              <Button type="primary" size="small" className="text-[10px] uppercase font-bold px-3 rounded shadow-sm hover:scale-105 transition-transform" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/rooms/${room.id}`);
                                }}>
                                View Details & Book
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ))
          )}
        </div>
      </Content>
      <ClientFooter />
    </Layout>
  );
}