import { useEffect, useState } from "react";
import { Button, Card, Space, Typography, message } from "antd";
import { 
  getRoomAmenities, 
  createRoomAmenity, 
  updateRoomAmenity, 
  deleteRoomAmenity 
} from "../../../apis/roomAmenityApi";
import { getRooms } from "../../../apis/roomApi";
import { getAmenities } from "../../../apis/amenityApi";
import AdminLayout from "../auth/AdminLayout";
import AdminRoomAmenityList from "./AdminRoomAmenityList";
import AdminRoomAmenitySearch from "./AdminRoomAmenitySearch";
import AdminRoomAmenityCreate from "./AdminRoomAmenityCreate";
import AdminRoomAmenityUpdate from "./AdminRoomAmenityUpdate";

const { Title, Text } = Typography;

export default function AdminRoomAmenityPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  const [filters, setFilters] = useState({ roomId: undefined, amenityId: undefined });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const extractError = (error) => {
    const serverData = error?.response?.data;
    if (error?.response?.status === 403) return "Access Denied: Session expired.";
    return (serverData?.errors && serverData?.errors[0]) || serverData?.message || "An unexpected error occurred.";
  };

  /**
   * LOAD DATA: Lấy toàn bộ dữ liệu quan hệ (size lớn) 
   * để Frontend tự thực hiện gộp nhóm theo Phòng.
   */
  const loadData = async (nextFilters = filters) => {
    setLoading(true);
    try {
      // Tăng size lên 1000 để tránh việc Backend ngắt trang làm mất tiện ích của phòng cuối trang
      const res = await getRoomAmenities({ 
        page: 0, 
        size: 1000, 
        ...nextFilters 
      });
      
      // Data này là mảng các dòng lẻ, Component List sẽ tự gộp lại thành từng dòng theo Phòng
      setData(res?.data?.items || []);

      // Load dữ liệu hỗ trợ nếu chưa có
      if (rooms.length === 0) {
        const rRes = await getRooms({ page: 0, size: 200 });
        setRooms(rRes?.data?.items || []);
      }
      if (amenities.length === 0) {
        const aRes = await getAmenities({ page: 0, size: 200 });
        setAmenities(aRes?.data?.items || []);
      }
    } catch (error) {
      messageApi.error(extractError(error));
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteRoomAmenity(id);
      messageApi.success("Amenity removed successfully");
      loadData();
    } catch (error) {
      messageApi.error(extractError(error));
    }
  };

  /**
   * CREATE: Gán nhiều tiện ích cho phòng
   * Lưu ý: Nếu Backend có API Sync (nhận mảng ID) thì nên đổi sang dùng Sync sẽ tốt hơn
   */
  const handleCreate = async (values) => {
    setModalLoading(true);
    try {
      const { roomId, amenityIds, description } = values;

      // Gọi API tạo cho từng tiện ích được chọn
      await Promise.all(
        amenityIds.map((amenityId) =>
          createRoomAmenity({ roomId, amenityId, description })
        )
      );

      messageApi.success(`Successfully assigned ${amenityIds.length} amenities`);
      setIsCreateOpen(false);
      loadData(); 
    } catch (error) {
      messageApi.error(extractError(error));
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    setModalLoading(true);
    try {
      await updateRoomAmenity(editingItem.id, values);
      messageApi.success("Updated successfully");
      setEditingItem(null);
      loadData();
    } catch (error) {
      messageApi.error(extractError(error));
    } finally { 
      setModalLoading(false); 
    }
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Space direction="vertical" size={24} className="w-full" style={{ width: '100%' }}>
        <div>
          <Title level={2} className="!mb-1">Room Amenities Management</Title>
          <Text type="secondary">Manage facilities and services for each room type and specific room number.</Text>
        </div>

        <Card className="shadow-sm">
          <AdminRoomAmenitySearch 
            rooms={rooms}
            amenities={amenities}
            onSearch={(f) => { 
              setFilters(f); 
              loadData(f); 
            }} 
          />
        </Card>

        <Card className="shadow-sm">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Room Assignment List</Title>
            <Button type="primary" size="large" onClick={() => setIsCreateOpen(true)}>
              Assign Amenities
            </Button>
          </div>
          
          <AdminRoomAmenityList 
            data={data} 
            loading={loading}
            // Pagination giờ đây Table sẽ tự tính dựa trên groupedData (số lượng phòng)
            onEdit={setEditingItem}
            onDelete={handleDelete}
          />
        </Card>
      </Space>

      <AdminRoomAmenityCreate 
        open={isCreateOpen} 
        loading={modalLoading}
        rooms={rooms}
        amenities={amenities}
        // Truyền dữ liệu hiện có để Modal biết phòng nào đã có tiện ích gì
        roomAmenitiesData={data} 
        onCancel={() => setIsCreateOpen(false)} 
        onSubmit={handleCreate} 
      />

      <AdminRoomAmenityUpdate 
        open={Boolean(editingItem)} 
        loading={modalLoading}
        rooms={rooms}
        amenities={amenities}
        initialValues={editingItem}
        onCancel={() => setEditingItem(null)} 
        onSubmit={handleUpdate} 
      />
    </AdminLayout>
  );
}