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
  
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ roomId: undefined, amenityId: undefined });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const extractError = (error) => {
    const serverData = error?.response?.data;
    if (error?.response?.status === 403) return "Access Denied: Your session may have expired.";
    return (serverData?.errors && serverData?.errors[0]) || serverData?.message || "An unexpected error occurred.";
  };

  const loadData = async (nextPage = page, nextSize = size, nextFilters = filters) => {
    setLoading(true);
    try {
      const res = await getRoomAmenities({ page: nextPage, size: nextSize, ...nextFilters });
      setData(res?.data?.items || []);
      setTotalPages(res?.data?.totalPages || 0);

      if (rooms.length === 0) {
        const rRes = await getRooms({ page: 0, size: 100 });
        setRooms(rRes?.data?.items || []);
      }
      if (amenities.length === 0) {
        const aRes = await getAmenities({ page: 0, size: 100 });
        setAmenities(aRes?.data?.items || []);
      }
    } catch (error) {
      messageApi.error(extractError(error));
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteRoomAmenity(id);
      messageApi.success("Amenity removed from room successfully");
      loadData();
    } catch (error) {
      messageApi.error(extractError(error));
    }
  };

  // --- UPDATED LOGIC FOR MULTIPLE ASSIGNMENT ---
  const handleCreate = async (values) => {
    setModalLoading(true);
    try {
      const { roomId, amenityIds, description } = values;

      // Map through each selected amenity ID and create an assignment request
      await Promise.all(
        amenityIds.map((amenityId) =>
          createRoomAmenity({ roomId, amenityId, description })
        )
      );

      messageApi.success(`Successfully assigned ${amenityIds.length} amenities to the room`);
      setIsCreateOpen(false);
      loadData(0); // Refresh to page 1 to see the new grouped data
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
      messageApi.success("Room amenity updated successfully");
      setEditingItem(null);
      loadData();
    } catch (error) {
      messageApi.error(extractError(error));
    } finally { setModalLoading(false); }
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Space direction="vertical" size={24} className="w-full">
        <div>
          <Title level={2} className="!mb-1">Room Amenities</Title>
          <Text type="secondary">Assign and manage multiple amenities for each specific room.</Text>
        </div>

        <Card className="shadow-sm">
          <AdminRoomAmenitySearch 
            rooms={rooms}
            amenities={amenities}
            onSearch={(f) => { setFilters(f); setPage(0); loadData(0, size, f); }} 
          />
        </Card>

        <Card className="shadow-sm">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={4}>Assignment List</Title>
            <Button type="primary" onClick={() => setIsCreateOpen(true)}>Assign Multiple Amenities</Button>
          </div>
          <AdminRoomAmenityList 
            data={data} 
            loading={loading}
            pagination={{ current: page + 1, pageSize: size, total: totalPages * size }}
            onTableChange={(p) => { setPage(p.current - 1); loadData(p.current - 1, p.pageSize); }}
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