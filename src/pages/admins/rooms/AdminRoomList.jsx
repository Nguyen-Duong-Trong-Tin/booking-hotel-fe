import { useState } from "react";
import { Table, Tag, Space, Button, Popconfirm, Image, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function AdminRoomList({ data, loading, pagination, onTableChange, onEdit, onDelete }) {
  // 1. Thêm state để quản lý loading khi đang xóa
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
      // message.success("Room deleted successfully"); // Tùy chọn nếu onUpdate chưa thông báo
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      title: "Image",
      key: "image",
      render: (_, record) => {
        const presentative = (record.roomImages || []).find((img) => img.isPresentative);
        if (!presentative?.url) {
          return <span className="text-gray-400 text-xs">No image</span>;
        }

        return (
          <Image.PreviewGroup
            items={(record.roomImages || []).map((img) => img.url).filter(Boolean)}
          >
            <Image
              src={presentative.url}
              width={56}
              height={56}
              style={{ objectFit: "cover", borderRadius: 6, cursor: "pointer" }}
              preview
            />
          </Image.PreviewGroup>
        );
      }
    },
    { title: "Room No.", dataIndex: "roomNumber", key: "roomNo" },
    { title: "Category", dataIndex: ["category", "name"], key: "category" },
    { 
      title: "Price", 
      dataIndex: "price", 
      render: (p) => <span className="font-semibold text-green-600">${p?.toLocaleString()}</span> 
    },
    { title: "Capacity", dataIndex: "capacity", render: (c) => `${c} Persons` },
    { 
      title: "Status", 
      dataIndex: "status",
      render: (status) => {
        let color = status === "AVAILABLE" ? "green" : status === "OCCUPIED" ? "blue" : "volcano";
        return <Tag color={color}>{status}</Tag>
      }
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)} 
            disabled={deletingId === record.id} // Vô hiệu hóa khi đang xóa
          />
          <Popconfirm 
            title="Delete room?" 
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okButtonProps={{ 
              danger: true, 
              loading: deletingId === record.id // Hiện icon xoay tròn khi đang đợi API
            }}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              loading={deletingId === record.id} // Hiện loading trên chính nút xóa
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      rowKey="id" 
      loading={loading} 
      pagination={pagination} 
      onChange={onTableChange} 
    />
  );
}