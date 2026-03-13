import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Layout, Row, Col, Typography, Button, Tag, 
  Space, Spin, Image, Divider, Card, message, Carousel 
} from "antd";
import { 
  UserOutlined, ArrowLeftOutlined, CheckCircleFilled, 
  HomeOutlined, LeftOutlined, RightOutlined, EyeOutlined
} from "@ant-design/icons";
import ClientHeader from "../../../components/layout/ClientHeader";
import ClientFooter from "../../../components/layout/ClientFooter";
import { getRoomById, getRooms } from "../../../apis/roomApi";
import { getRoomAmenities } from "../../../apis/roomAmenityApi"; 

const { Content } = Layout;
const { Title, Text } = Typography;

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const carouselRef = useRef();
  
  const [room, setRoom] = useState(null);
  const [amenities, setAmenities] = useState([]); 
  const [relatedRooms, setRelatedRooms] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 1. Lấy thông tin phòng hiện tại
        const roomRes = await getRoomById(id);
        const currentRoom = roomRes?.data || roomRes;
        setRoom(currentRoom);

        const currentCategoryId = currentRoom?.category?.id;

        // 2. Lấy tiện ích và phòng cùng loại
        // CHÚ Ý: Truyền đúng key 'categoryId' mà Backend yêu cầu để lọc
        const [amenityRes, relatedRes] = await Promise.all([
          getRoomAmenities({ roomId: id, size: 100 }),
          getRooms({ 
            categoryId: currentCategoryId, // Đảm bảo chỉ lấy phòng cùng Category này
            size: 50 // Lấy danh sách đủ lớn để lọc
          })
        ]);

        const amenityList = amenityRes?.data?.items || amenityRes?.items || [];
        setAmenities(amenityList);

        // 3. LOGIC LỌC CHẶT CHẼ: 
        // Chỉ lấy những phòng có category.id trùng khớp hoàn toàn và khác ID phòng hiện tại
        const allRooms = relatedRes?.data?.items || relatedRes?.items || [];
        const filteredRelated = allRooms
          .filter(r => r.category?.id === currentCategoryId && r.id !== currentRoom.id)
          .slice(0, 4); // Chỉ hiển thị 4 phòng tương tự đẹp nhất
          
        setRelatedRooms(filteredRelated);

      } catch (error) {
        console.error("Error:", error);
        message.error("Không thể tải thông tin phòng.");
        navigate("/rooms");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-white">
        <Spin size="large" tip="Đang tìm kiếm không gian tương tự..." />
      </div>
    );
  }

  const images = room?.roomImages || [];

  return (
    <Layout className="min-h-screen bg-white">
      <ClientHeader />
      <Content className="max-w-7xl mx-auto w-full px-4 py-8">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate("/rooms")} 
          className="mb-6 border-none shadow-none text-slate-500 hover:text-blue-600 flex items-center p-0"
        >
          Back to Accommodations
        </Button>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={14}>
            <div className="relative group rounded-3xl overflow-hidden shadow-sm bg-slate-50">
               <Button 
                  shape="circle"
                  icon={<LeftOutlined />}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md border-none"
                  onClick={() => carouselRef.current.prev()}
               />
               <Carousel ref={carouselRef} dots={true} infinite autoplay>
                  {images.length > 0 ? (
                    images.map((img) => (
                      <div key={img.id}>
                        <Image src={img.url} preview={true} className="w-full h-[500px] object-cover" />
                      </div>
                    ))
                  ) : (
                    <Image src="https://via.placeholder.com/800x500?text=No+Image" className="w-full h-[500px] object-cover" />
                  )}
               </Carousel>
               <Button 
                  shape="circle"
                  icon={<RightOutlined />}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md border-none"
                  onClick={() => carouselRef.current.next()}
               />
               {images.length > 1 && (
                 <div className="p-4 flex gap-4 overflow-x-auto bg-white border-t border-slate-100 no-scrollbar">
                    {images.map((img, index) => (
                      <img 
                        key={img.id} src={img.url} alt="thumb"
                        onClick={() => carouselRef.current.goTo(index)}
                        className="w-[100px] h-[70px] rounded-xl object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-all flex-shrink-0" 
                      />
                    ))}
                 </div>
               )}
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <Card className="border-slate-100 shadow-sm rounded-3xl sticky top-8">
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Tag color="blue" className="uppercase font-bold px-3 py-0.5 rounded-full mb-3 border-none">
                    {room?.category?.name}
                  </Tag>
                  <Title level={1} className="!mt-0 !mb-0 text-slate-800">Room {room?.roomNumber}</Title>
                </div>
                <div className="flex items-center">
                  <Text className="text-4xl font-black text-blue-600">${room?.price?.toLocaleString()}</Text>
                </div>
                <Divider className="my-0" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <UserOutlined className="text-blue-500 text-xl" />
                    <div className="flex flex-col">
                      <Text className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-0.5">Capacity</Text>
                      <Text strong className="text-base text-slate-700 leading-tight">{room?.capacity} Persons</Text>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <HomeOutlined className="text-purple-500 text-xl" />
                    <div className="flex flex-col">
                      <Text className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-0.5">Category</Text>
                      <Text strong className="text-base text-slate-700 leading-tight">{room?.category?.name}</Text>
                    </div>
                  </div>
                </div>
                <div>
                  <Title level={5} className="mb-4 text-slate-600">Room Amenities</Title>
                  {amenities.length > 0 ? (
                    <div className="grid grid-cols-2 gap-y-4">
                      {amenities.map((item) => (
                        <Space key={item.id} align="start">
                          <CheckCircleFilled className="text-green-500 mt-1" /> 
                          <div className="flex flex-col">
                            <Text strong className="text-sm text-slate-700 leading-none">{item.amenity?.name}</Text>
                            {item.description && <Text className="text-[11px] text-slate-400 mt-1">{item.description}</Text>}
                          </div>
                        </Space>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center">
                       <Text type="secondary" italic>No amenities assigned yet.</Text>
                    </div>
                  )}
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  className="h-16 mt-4 rounded-2xl text-lg font-bold bg-blue-600 border-none shadow-lg shadow-blue-100"
                  onClick={() => navigate(`/rooms/${id}/booking`)}
                >
                  Book This Room Now
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* PHẦN PHÒNG TƯƠNG TỰ - CHỈ HIỂN THỊ CÙNG LOẠI */}
        {relatedRooms.length > 0 && (
          <div className="mt-20">
            <Divider orientation="left">
              <Title level={3} className="!text-slate-800 uppercase tracking-widest text-sm">
                More {room?.category?.name} Rooms
              </Title>
            </Divider>
            <Row gutter={[24, 24]} className="mt-8">
              {relatedRooms.map((r) => {
                const rMainImg = r.roomImages?.find(i => i.isPresentative)?.url || r.roomImages?.[0]?.url;
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={r.id}>
                    <Card
                      hoverable
                      className="rounded-2xl overflow-hidden border-slate-100 shadow-sm group bg-slate-50/50"
                      cover={
                        <div className="relative h-48 overflow-hidden">
                          <img alt="room" src={rMainImg || "https://via.placeholder.com/400x300"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button shape="circle" icon={<EyeOutlined />} size="large" onClick={() => navigate(`/rooms/${r.id}`)} />
                          </div>
                        </div>
                      }
                      onClick={() => navigate(`/rooms/${r.id}`)}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <Text strong className="text-base">Room {r.roomNumber}</Text>
                          <Text className="text-blue-600 font-black">${r.price?.toLocaleString()}</Text>
                        </div>
                        <div className="flex justify-between items-center">
                          <Space className="text-slate-400 text-[11px] font-bold uppercase tracking-tighter">
                            <UserOutlined /> {r.capacity} Persons
                          </Space>
                          <Tag className="mr-0 border-none bg-blue-50 text-blue-500 text-[10px] font-bold">
                            {r.category?.name}
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}

        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </Content>
      <ClientFooter />
    </Layout>
  );
}