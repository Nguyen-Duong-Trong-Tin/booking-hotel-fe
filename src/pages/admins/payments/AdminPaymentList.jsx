import { Table, Tag, Space, Button, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AdminPaymentDelete from "./AdminPaymentDelete";

export default function AdminPaymentList({ 
  data = [], 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete 
}) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      align: "center",
    },
    {
      title: "Booking",
      dataIndex: ["booking", "id"],
      key: "bookingId",
      render: (id) => <Tag color="blue">#BK-{id}</Tag>,
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => (
        <span style={{ fontSize: '13px', color: '#595959' }}>
          {date ? dayjs(date).format("MM/DD/YYYY HH:mm") : "-"}
        </span>
      ),
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => <Tag icon={null}>{method?.toUpperCase()}</Tag>,
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
      // Hiển thị màu xanh lá nhạt #73d13d và số nguyên giống trang Rooms
      render: (val) => (
        <b style={{ color: '#73d13d', fontSize: '15px' }}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(val || 0)}
        </b>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "gold";
        if (status === "COMPLETED") color = "green";
        if (status === "FAILED" || status === "CANCELLED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          {/* Nút sửa: Màu đen, có viền bao */}
          <Tooltip title="Edit">
            <Button 
              style={{ 
                color: "#262626", 
                borderColor: "#d9d9d9",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)} 
            />
          </Tooltip>

          {/* Nút xóa: Dùng component riêng với viền đỏ */}
          <AdminPaymentDelete onConfirm={() => onDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={Array.isArray(data) ? data : []}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      onChange={onTableChange}
      bordered
      size="middle"
      className="mt-4"
    />
  );
}