import { useEffect, useMemo, useState, useCallback } from "react";
import { Button, Card, Descriptions, Image, Modal, Space, Tag, Typography, message } from "antd";
import AdminLayout from "../auth/AdminLayout";
import AdminBookingList from "./AdminBookingList";
import AdminBookingSearch from "./AdminBookingSearch";
import AdminBookingCreate from "./AdminBookingCreate";
import AdminBookingUpdate from "./AdminBookingUpdate";
import AdminBookingQrScanner from "./AdminBookingQrScanner";

import { 
  getBookings, 
  getRooms, 
  createBooking, 
  updateBooking,
  deleteBooking,
  updateBookingStatus,
  getBookingById
} from "../../../apis/bookingApi";
import { getUsers } from "../../../apis/userApi";
import { getRoomAmenities } from "../../../apis/roomAmenityApi";

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
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scannedBooking, setScannedBooking] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanAmenities, setScanAmenities] = useState([]);

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

  const parseBookingId = (text) => {
    const match = String(text).match(/\d+/);
    return match ? Number(match[0]) : null;
  };

  const handleScanResult = async (text) => {
    const bookingId = parseBookingId(text);
    if (!bookingId) {
      messageApi.error("Invalid booking QR code.");
      return;
    }

    setScanLoading(true);
    try {
      const response = await getBookingById(bookingId);
      const booking = response?.data || response;
      const roomId = booking?.room?.id;
      let amenities = [];

      if (roomId) {
        const amenityRes = await getRoomAmenities({ page: 0, size: 100, roomId });
        const spec = amenityRes?.data;
        amenities = spec?.items || spec?.content || spec || [];
      }

      setScannedBooking(booking);
      setScanAmenities(Array.isArray(amenities) ? amenities : []);
      setIsScanOpen(false);
    } catch (error) {
      messageApi.error("Booking not found.");
    } finally {
      setScanLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "CONFIRMED") return "green";
    if (status === "COMPLETED") return "blue";
    if (status === "CANCELLED") return "red";
    return "gold";
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
            <Space>
              <Button onClick={() => setIsScanOpen(true)}>
                Scan QR
              </Button>
              <Button type="primary" onClick={() => setIsCreateOpen(true)}>
                New Booking
              </Button>
            </Space>
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

      <AdminBookingQrScanner
        open={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onScan={handleScanResult}
      />

      <Modal
        open={Boolean(scannedBooking)}
        onCancel={() => setScannedBooking(null)}
        footer={null}
        title="Booking Details"
        destroyOnClose
      >
        <Descriptions bordered column={1} size="small" loading={scanLoading}>
          <Descriptions.Item label="Booking ID">
            {scannedBooking?.id || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(scannedBooking?.status)}>
              {scannedBooking?.status || "N/A"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Check-in">
            {scannedBooking?.checkIn || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Check-out">
            {scannedBooking?.checkOut || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Payment method">
            {scannedBooking?.paymentMethod || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Total price">
            {scannedBooking?.totalPrice || "0"}
          </Descriptions.Item>
          <Descriptions.Item label="Customer">
            {scannedBooking?.user?.fullName || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Customer email">
            {scannedBooking?.user?.email || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Room">
            {scannedBooking?.room?.roomNumber ? `Room ${scannedBooking.room.roomNumber}` : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Category">
            {scannedBooking?.room?.category?.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Capacity">
            {scannedBooking?.room?.capacity ? `${scannedBooking.room.capacity} persons` : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Room price">
            {scannedBooking?.room?.price || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            {(scannedBooking?.room?.latitude != null && scannedBooking?.room?.longitude != null)
              ? `${scannedBooking.room.latitude}, ${scannedBooking.room.longitude}`
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Room status">
            {scannedBooking?.room?.status || "N/A"}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-4">
          <div className="font-semibold mb-2">Room Images</div>
          {Array.isArray(scannedBooking?.room?.roomImages) && scannedBooking.room.roomImages.length > 0 ? (
            <Image.PreviewGroup
              items={scannedBooking.room.roomImages.map((img) => img.url).filter(Boolean)}
            >
              <Space wrap>
                {scannedBooking.room.roomImages.map((img) => (
                  <Image
                    key={img.id}
                    src={img.url}
                    width={96}
                    height={72}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                ))}
              </Space>
            </Image.PreviewGroup>
          ) : (
            <div className="text-slate-500">No images</div>
          )}
        </div>

        <div className="mt-4">
          <div className="font-semibold mb-2">Amenities</div>
          {scanAmenities.length > 0 ? (
            <Space wrap>
              {scanAmenities.map((item) => (
                <Tag key={item.id}>
                  {item?.amenity?.name || "Amenity"}
                </Tag>
              ))}
            </Space>
          ) : (
            <div className="text-slate-500">No amenities</div>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
}