import { Table, Button, Space, Avatar, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import AdminAmenityDelete from "./AdminAmenityDelete";

export default function AdminAmenityList({ amenities, loading, pagination, onTableChange, onEdit, onDelete }) {
  const columns = [
    {
      title: "Icon",
      dataIndex: "iconUrl",
      key: "iconUrl",
      width: 80,
      render: (url) => <Avatar src={url} shape="square" size="large" icon={!url && "A"} />,
    },
    {
      title: "Amenity Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {/* Nút sửa: Đen, có viền bao */}
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

          {/* Nút xóa: Component riêng sẽ xử lý viền đỏ */}
          <Tooltip title="Delete">
            <AdminAmenityDelete onConfirm={() => onDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={amenities}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      onChange={onTableChange}
      bordered // Thêm viền bảng cho chuyên nghiệp
      size="middle"
    />
  );
}