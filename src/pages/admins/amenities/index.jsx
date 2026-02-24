import { useEffect, useMemo, useState } from "react";
import { Button, Card, Space, Typography, message } from "antd";
import { getAmenities, createAmenity, updateAmenity, deleteAmenity } from "../../../apis/amenityApi";
import AdminLayout from "../auth/AdminLayout";
import AdminAmenityCreate from "./AdminAmenityCreate";
import AdminAmenityUpdate from "./AdminAmenityUpdate";
import AdminAmenityList from "./AdminAmenityList";
import AdminAmenitySearch from "./AdminAmenitySearch";

const { Title, Text } = Typography;
const DEFAULT_PAGE_SIZE = 10;

export default function AdminAmenityPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [listLoading, setListLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ name: "" });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);

  const pagination = useMemo(() => ({
    current: page + 1,
    pageSize: size,
    total: (totalPages || 0) * size,
    showSizeChanger: true
  }), [page, size, totalPages]);

  const loadAmenities = async (nextPage = page, nextSize = size, nextFilters = filters) => {
    setListLoading(true);
    try {
      const response = await getAmenities({ page: nextPage, size: nextSize, name: nextFilters.name });
      const spec = response?.data;
      setAmenities(spec?.items || []);
      setPage(spec?.page ?? 0);
      setSize(spec?.size ?? nextSize);
      setTotalPages(spec?.totalPages ?? 0);
    } catch (error) {
      messageApi.error("Failed to load amenities list");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => { loadAmenities(); }, []);

  const handleTableChange = (p) => {
    setPage(p.current - 1);
    setSize(p.pageSize);
    loadAmenities(p.current - 1, p.pageSize, filters);
  };

  const handleCreateFinish = async (values) => {
    setModalLoading(true);
    try {
      await createAmenity(values);
      messageApi.success("Amenity created successfully");
      setIsCreateOpen(false);
      loadAmenities(0, size, filters);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Creation failed");
    } finally { setModalLoading(false); }
  };

  const handleUpdateFinish = async (values) => {
    if (!editingAmenity) return;
    setModalLoading(true);
    try {
      await updateAmenity(editingAmenity.id, values);
      messageApi.success("Amenity updated successfully");
      setEditingAmenity(null);
      loadAmenities();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Update failed");
    } finally { setModalLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAmenity(id);
      messageApi.success("Amenity deleted successfully");
      loadAmenities();
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409 || status === 500) {
        messageApi.error("Cannot delete: This amenity is linked to existing hotels or rooms.");
      } else {
        messageApi.error("Delete failed");
      }
    }
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Space direction="vertical" size={24} className="w-full">
        <div>
          <Title level={2} className="!mb-1">Amenities</Title>
          <Text type="secondary">Manage hotel facilities and available services.</Text>
        </div>
        <Card className="shadow-sm">
          <AdminAmenitySearch 
            filters={filters}
            onSearch={(f) => { setFilters(f); setPage(0); loadAmenities(0, size, f); }}
            onReset={() => { const r = {name:""}; setFilters(r); loadAmenities(0, size, r); }}
          />
        </Card>
        <Card className="shadow-sm">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} className="!mb-0">Amenity List</Title>
            <Button type="primary" onClick={() => setIsCreateOpen(true)}>New Amenity</Button>
          </div>
          <AdminAmenityList 
            amenities={amenities} loading={listLoading} pagination={pagination}
            onTableChange={handleTableChange} onEdit={setEditingAmenity} onDelete={handleDelete}
          />
        </Card>
      </Space>
      <AdminAmenityCreate open={isCreateOpen} loading={modalLoading} onCancel={() => setIsCreateOpen(false)} onSubmit={handleCreateFinish} />
      <AdminAmenityUpdate open={Boolean(editingAmenity)} loading={modalLoading} amenity={editingAmenity} onCancel={() => setEditingAmenity(null)} onSubmit={handleUpdateFinish} />
    </AdminLayout>
  );
}