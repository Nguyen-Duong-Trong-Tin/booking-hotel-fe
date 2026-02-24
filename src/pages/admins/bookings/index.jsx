import { useEffect, useMemo, useState, useCallback } from "react";
import { Button, Card, Space, Typography, message } from "antd";
import AdminLayout from "../auth/AdminLayout";
import AdminBookingList from "./AdminBookingList";
import AdminBookingSearch from "./AdminBookingSearch";
import AdminBookingCreate from "./AdminBookingCreate";
import AdminBookingUpdate from "./AdminBookingUpdate";

import { 
  getBookings, 
  getRooms, 
  createBooking, 
  updateBooking,
  deleteBooking,
  updateBookingStatus 
} from "../../../apis/bookingApi";
import { getUsers } from "../../../apis/userApi";

const { Title, Text } = Typography;
const DEFAULT_PAGE_SIZE = 10;

export default function AdminBookingPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [listLoading, setListLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);

  // Pagination States
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);

  // Filters & Modals
  const [filters, setFilters] = useState({ roomId: null, status: null, checkIn: null, checkOut: null });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const pagination = useMemo(() => {
    return {
      current: page + 1,
      pageSize: size,
      total: totalPages * size,
      showSizeChanger: true,
      showTotal: (total) => `Total ${total} bookings`
    };
  }, [page, size, totalPages]);

  // Load Main Data
  const loadData = useCallback(async (nextPage = page, nextSize = size, nextFilters = filters) => {
    setListLoading(true);
    try {
      const response = await getBookings({
        page: nextPage,
        size: nextSize,
        ...nextFilters
      });
      const spec = response?.data;

      setBookings(spec?.items || spec?.content || []);
      setPage(typeof spec?.page === "number" ? spec.page : 0);
      setTotalPages(typeof spec?.totalPages === "number" ? spec.totalPages : 0);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Failed to load bookings");
    } finally {
      setListLoading(false);
    }
  }, [page, size, filters, messageApi]);

  // Load Resources (Rooms & Users) for Modals
  const loadResources = async () => {
    try {
      const [roomRes, userRes] = await Promise.all([
        getRooms(),
        getUsers({ page: 0, size: 500, roleName: "USER" })
      ]);
      setRooms(roomRes?.data?.items || roomRes?.data || []);
      setUsers(userRes?.data?.items || userRes?.data?.content || []);
    } catch (error) {
      console.error("Resource loading failed", error);
    }
  };

  useEffect(() => {
    loadData();
    loadResources();
  }, []);

  // Handlers
  const handleTableChange = (paginationConfig) => {
    const nextPage = paginationConfig.current - 1;
    const nextSize = paginationConfig.pageSize;
    setPage(nextPage);
    setSize(nextSize);
    loadData(nextPage, nextSize, filters);
  };

  const handleSearch = (nextFilters) => {
    setFilters(nextFilters);
    setPage(0);
    loadData(0, size, nextFilters);
  };

  const handleSearchReset = () => {
    const resetFilters = { roomId: null, status: null, checkIn: null, checkOut: null };
    setFilters(resetFilters);
    setPage(0);
    loadData(0, size, resetFilters);
  };

  const handleCreateFinish = async (values) => {
    setModalLoading(true);
    try {
      await createBooking(values);
      messageApi.success("Booking created successfully");
      setIsCreateOpen(false);
      loadData();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Creation failed");
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateFinish = async (values) => {
    if (!editingBooking) return;
    setModalLoading(true);
    try {
      await updateBooking(editingBooking.id, values);
      messageApi.success("Booking updated successfully");
      setEditingBooking(null);
      loadData();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Update failed");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      messageApi.success("Booking deleted");
      loadData();
    } catch (error) {
      messageApi.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <div>
          <Title level={2} className="!mb-1">Booking Management</Title>
          <Text type="secondary">Manage customer room bookings and statuses.</Text>
        </div>

        <Card className="shadow-sm">
          <AdminBookingSearch 
            rooms={rooms}
            onSearch={handleSearch} 
            onReset={handleSearchReset} 
          />
        </Card>

        <Card className="shadow-sm">
          <Space className="w-full justify-between" align="center" style={{ marginBottom: 16 }}>
            <Title level={4} className="!mb-0">Booking List</Title>
            <Button type="primary" onClick={() => setIsCreateOpen(true)}>
              New Booking
            </Button>
          </Space>

          <AdminBookingList 
            data={bookings} 
            loading={listLoading} 
            pagination={pagination}
            onTableChange={handleTableChange}
            onEdit={setEditingBooking}
            onDelete={handleDelete}
            onUpdateStatus={async (id, s) => {
                await updateBookingStatus(id, s);
                loadData();
            }}
          />
        </Card>
      </Space>

      <AdminBookingCreate 
        open={isCreateOpen} 
        loading={modalLoading}
        rooms={rooms}
        users={users}
        onCancel={() => setIsCreateOpen(false)} 
        onSubmit={handleCreateFinish}
      />

      <AdminBookingUpdate 
        open={Boolean(editingBooking)} 
        loading={modalLoading}
        initialValues={editingBooking}
        rooms={rooms} 
        users={users} 
        onCancel={() => setEditingBooking(null)} 
        onSubmit={handleUpdateFinish}
      />
    </AdminLayout>
  );
}