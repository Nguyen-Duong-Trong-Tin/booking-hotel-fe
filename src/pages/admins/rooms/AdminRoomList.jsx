import { Table, Tag, Space, Button, Popconfirm, Image } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function AdminRoomList({ data, loading, pagination, onTableChange, onEdit, onDelete }) {
  const columns = [
    {
      title: "Image",
      key: "image",
      render: (_, record) => {
        const presentative = (record.roomImages || []).find((img) => img.isPresentative);
        if (!presentative?.url) {
          return <span className="text-gray-400">No image</span>;
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
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm title="Delete room?" onConfirm={() => onDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={pagination} onChange={onTableChange} />;
}