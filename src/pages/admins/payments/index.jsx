import { useEffect, useMemo, useState, useCallback } from "react";
import { Button, Card, Space, Typography, message } from "antd";
import AdminLayout from "../auth/AdminLayout";
import AdminPaymentList from "./AdminPaymentList";
import AdminPaymentSearch from "./AdminPaymentSearch";
import AdminPaymentCreate from "./AdminPaymentCreate";
import AdminPaymentUpdate from "./AdminPaymentUpdate";
import { getPayments, createPayment, updatePayment, deletePayment } from "../../../apis/paymentApi";
import { getBookings } from "../../../apis/bookingApi";

const { Title, Text } = Typography;

export default function AdminPaymentPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const pagination = useMemo(() => ({
    current: page + 1,
    pageSize: size,
    total: totalPages * size,
    showTotal: (total) => `Total ${total} payments`
  }), [page, size, totalPages]);

  const loadData = useCallback(async (nextPage = page, nextSize = size, nextFilters = filters) => {
    setLoading(true);
    try {
      const res = await getPayments({ page: nextPage, size: nextSize, ...nextFilters });
      setPayments(res?.data?.items || []);
      setTotalPages(res?.data?.totalPages || 0);
      
      const bookRes = await getBookings({ size: 100 });
      setBookings(bookRes?.data?.items || []);
    } catch (err) {
      messageApi.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [page, size, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <AdminLayout>
      {contextHolder}
      <Space direction="vertical" size={24} className="w-full">
        <div>
          <Title level={2} className="!mb-1">Payment Management</Title>
          <Text type="secondary">Track and manage hotel revenue and transactions.</Text>
        </div>

        <Card className="shadow-sm">
          <AdminPaymentSearch onSearch={(v) => {
            if(v.paymentDate) v.paymentDate = v.paymentDate.format("YYYY-MM-DD");
            setFilters(v); setPage(0); loadData(0, size, v);
          }} onReset={() => { setFilters({}); setPage(0); loadData(0, size, {}); }} />
        </Card>

        <Card className="shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="!mb-0">Transaction List</Title>
            <Button type="primary" onClick={() => setIsCreateOpen(true)}>New Payment</Button>
          </div>
          <AdminPaymentList 
            data={payments} loading={loading} pagination={pagination}
            onTableChange={(p) => { setPage(p.current - 1); setSize(p.pageSize); loadData(p.current - 1, p.pageSize); }}
            onEdit={setEditingItem}
            onDelete={async (id) => { await deletePayment(id); messageApi.success("Deleted"); loadData(); }}
          />
        </Card>
      </Space>

      <AdminPaymentCreate open={isCreateOpen} bookings={bookings} onCancel={() => setIsCreateOpen(false)} 
        onSubmit={async (v) => { await createPayment(v); setIsCreateOpen(false); loadData(); }} />

      <AdminPaymentUpdate open={!!editingItem} payment={editingItem} bookings={bookings} onCancel={() => setEditingItem(null)} 
        onSubmit={async (v) => { await updatePayment(editingItem.id, v); setEditingItem(null); loadData(); }} />
    </AdminLayout>
  );
}