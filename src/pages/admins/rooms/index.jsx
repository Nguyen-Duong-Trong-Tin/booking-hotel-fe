import { useEffect, useState } from "react";
// Đã thêm Typography vào import
import { Button, Card, Space, Typography, message } from "antd";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../../apis/roomApi";
import { uploadRoomImages } from "../../../apis/roomImageApi";
import { getCategories } from "../../../apis/categoryApi";
import AdminLayout from "../auth/AdminLayout";
import AdminRoomList from "./AdminRoomList";
import AdminRoomSearch from "./AdminRoomSearch";
import AdminRoomCreate from "./AdminRoomCreate";
import AdminRoomUpdate from "./AdminRoomUpdate";

const { Title, Text } = Typography;

export default function AdminRoomPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ roomNumber: "", status: "", categoryName: "" });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const loadData = async (nextPage = page, nextSize = size, nextFilters = filters) => {
    setLoading(true);
    try {
      const roomRes = await getRooms({ page: nextPage, size: nextSize, ...nextFilters });
      setRooms(roomRes?.data?.items || []);
      setTotalPages(roomRes?.data?.totalPages || 0);
      
      if (categories.length === 0) {
        const catRes = await getCategories({ page: 0, size: 100 });
        setCategories(catRes?.data?.items || []);
      }
    } catch (error) {
      if (error?.response?.status === 403) {
        messageApi.error("Access Denied: Your session may have expired.");
      } else {
        messageApi.error("Failed to load data from server.");
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const extractError = (error) => {
    const serverData = error?.response?.data;
    const status = error?.response?.status;
    if (status === 403) return "Access Denied: You don't have permission for this action.";
    return (
      (serverData?.errors && serverData?.errors[0]) || 
      serverData?.message || 
      "An unexpected error occurred."
    );
  };

  const handleCreate = async (values) => {
    setModalLoading(true);
    try {
      const { images, presentativeUid, ...payload } = values;
      const roomRes = await createRoom(payload);
      const roomId = roomRes?.data?.id;

      if (roomId && images?.length) {
        const files = images
          .map((item) => item.originFileObj)
          .filter(Boolean);
        const presentativeIndex = presentativeUid
          ? images.findIndex((item) => item.uid === presentativeUid)
          : null;

        if (files.length) {
          try {
            await uploadRoomImages({
              roomId,
              images: files,
              presentativeIndex: presentativeIndex >= 0 ? presentativeIndex : null
            });
          } catch (uploadError) {
            messageApi.error("Room created, but image upload failed.");
          }
        }
      }

      messageApi.success("Room created successfully");
      setIsCreateOpen(false);
      loadData(0);
    } catch (error) {
      messageApi.error(extractError(error));
      console.log("Debug Error Detail:", error?.response?.data);
    } finally { setModalLoading(false); }
  };

  const handleUpdate = async (values) => {
    setModalLoading(true);
    try {
      const { images, presentativeUid, ...payload } = values;
      await updateRoom(editingRoom.id, payload);

      if (images?.length) {
        const files = images
          .map((item) => item.originFileObj)
          .filter(Boolean);
        const presentativeIndex = presentativeUid
          ? images.findIndex((item) => item.uid === presentativeUid)
          : null;

        if (files.length) {
          try {
            await uploadRoomImages({
              roomId: editingRoom.id,
              images: files,
              presentativeIndex: presentativeIndex >= 0 ? presentativeIndex : null
            });
          } catch (uploadError) {
            messageApi.error("Room updated, but image upload failed.");
          }
        }
      }

      messageApi.success("Room updated successfully");
      setEditingRoom(null);
      loadData();
    } catch (error) {
      messageApi.error(extractError(error));
    } finally { setModalLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRoom(id);
      messageApi.success("Room deleted successfully");
      loadData();
    } catch (error) {
      messageApi.error(extractError(error));
    }
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Space direction="vertical" size={24} className="w-full">
        {/* Phần tiêu đề mới được sửa ở đây */}
        <div>
          <Title level={2} className="!mb-1">
            Rooms
          </Title>
          <Text type="secondary">Create and manage hotel rooms and their status.</Text>
        </div>

        <Card className="shadow-sm">
          <AdminRoomSearch 
            onSearch={(f) => { setFilters(f); setPage(0); loadData(0, size, f); }} 
            categories={categories}
          />
        </Card>
        <Card className="shadow-sm">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={4}>Room List</Title>
            <Button type="primary" onClick={() => setIsCreateOpen(true)}>Add Room</Button>
          </div>
          <AdminRoomList 
            data={rooms} 
            loading={loading}
            pagination={{ current: page + 1, pageSize: size, total: totalPages * size }}
            onTableChange={(p) => { setPage(p.current - 1); loadData(p.current - 1, p.pageSize); }}
            onEdit={setEditingRoom}
            onDelete={handleDelete}
          />
        </Card>
      </Space>

      <AdminRoomCreate 
        open={isCreateOpen} 
        loading={modalLoading}
        categories={categories}
        onCancel={() => setIsCreateOpen(false)} 
        onSubmit={handleCreate} 
      />

      <AdminRoomUpdate 
        open={Boolean(editingRoom)} 
        loading={modalLoading}
        room={editingRoom}
        categories={categories}
        onCancel={() => setEditingRoom(null)} 
        onSubmit={handleUpdate} 
      />
    </AdminLayout>
  );
}