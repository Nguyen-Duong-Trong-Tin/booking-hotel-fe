import { Table, Tag, Space, Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function AdminBookingList({ 
  data = [], 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete 
}) {
  const columns = [
    {
      title: "Customer",
      dataIndex: ["user", "fullName"],
      key: "user",
      render: (text) => <span style={{ fontWeight: 500 }}>{text || "N/A"}</span>, 
    },
    {
      title: "Room",
      dataIndex: ["room", "roomNumber"],
      key: "room",
      render: (num) => <Tag color="blue">Room {num}</Tag>,
    },
    {
      title: "Stay Dates",
      key: "dates",
      render: (_, record) => (
        <span style={{ fontSize: '13px', color: '#595959' }}>
          {dayjs(record.checkIn).format("MM/DD/YYYY")} - {dayjs(record.checkOut).format("MM/DD/YYYY")}
        </span>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (p) => (
        <b style={{ color: '#73d13d', fontSize: '15px' }}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(p || 0)}
        </b>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status === "CONFIRMED" ? "green" : "gold";
        if (status === "CANCELLED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {/* Nút sửa: Màu đen, có viền bao */}
          <Tooltip title="Edit">
            <Button 
              variant="outlined" // Antd v5 sử dụng variant hoặc dùng mặc định có border
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
          
          {/* Nút xóa: Màu đỏ, có viền bao */}
          <Popconfirm 
            title="Delete this booking?" 
            description="Are you sure you want to delete this record?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button 
                danger
                variant="outlined"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={Array.isArray(data) ? data : []} 
      loading={loading} 
      rowKey="id" 
      pagination={pagination}
      onChange={onTableChange}
      bordered
      size="middle"
    />
  );
}