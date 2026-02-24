import { Button, Space, Table } from "antd";
import AdminRoleDelete from "./AdminRoleDelete";

export default function AdminRoleList({
  roles,
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
      width: 80
    },
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (value) => value || "-"
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <AdminRoleDelete onConfirm={() => onDelete(record.id)} />
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={roles}
      loading={loading}
      pagination={pagination}
      onChange={onTableChange}
      className="mt-4"
    />
  );
}
