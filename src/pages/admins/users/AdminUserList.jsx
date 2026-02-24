import { Button, Space, Table, Tag } from "antd";
import AdminUserDelete from "./AdminUserDelete";

export default function AdminUserList({ users, loading, pagination, onTableChange, onEdit, onDelete }) {
  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "Full Name", dataIndex: "fullName", render: (text) => <strong>{text}</strong> },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { 
      title: "Role", 
      dataIndex: "role", 
      render: (role) => <Tag color="blue">{role?.name || "N/A"}</Tag> 
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => onEdit(record)}>Edit</Button>
          <AdminUserDelete onConfirm={() => onDelete(record.id)} />
        </Space>
      )
    }
  ];

  return (
    <Table 
      rowKey="id" 
      columns={columns} 
      dataSource={users} 
      loading={loading} 
      pagination={pagination} 
      onChange={onTableChange} 
    />
  );
}