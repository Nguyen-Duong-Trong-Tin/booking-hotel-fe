import { Table, Button, Space, Popconfirm, Avatar, Tag, Typography } from "antd";
import { EditOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function AdminRoomAmenityList({ data, loading, pagination, onTableChange, onEdit, onDelete }) {
  
  // Màu sắc và độ dày viền phân cách (Bạn có thể chỉnh ở đây)
  const groupBorderStyle = '2px solid #333'; // Màu xám đậm để phân chia rõ nhất

  // Logic gộp ô cho cột Room và Category
  const sharedOnCell = (record, index) => {
    const sameRoomRows = data.filter(item => item.room?.roomNumber === record.room?.roomNumber);
    const firstRowIndex = data.findIndex(item => item.room?.roomNumber === record.room?.roomNumber);
    const isFirstRowOfGroup = index === firstRowIndex;

    const style = { verticalAlign: 'middle' };
    // Thêm viền trên nếu là dòng đầu tiên của một nhóm mới (trừ dòng đầu tiên của bảng)
    if (isFirstRowOfGroup && index !== 0) {
      style.borderTop = groupBorderStyle;
    }

    return {
      rowSpan: isFirstRowOfGroup ? sameRoomRows.length : 0,
      style: style
    };
  };

  // Logic viền cho các cột không gộp ô (Amenity, Description, Actions)
  const nonGroupedOnCell = (record, index) => {
    const firstRowIndex = data.findIndex(item => item.room?.roomNumber === record.room?.roomNumber);
    if (index === firstRowIndex && index !== 0) {
      return { style: { borderTop: groupBorderStyle } };
    }
    return {};
  };

  const columns = [
    {
      title: "Room",
      dataIndex: ["room", "roomNumber"],
      key: "roomNumber",
      width: 100,
      align: "center",
      onCell: sharedOnCell,
      render: (text) => <Tag color="blue" style={{ fontWeight: 'bold' }}>Room {text}</Tag>
    },
    {
      title: "Category",
      dataIndex: ["room", "category", "name"],
      key: "category",
      width: 130,
      align: "center",
      onCell: sharedOnCell,
      render: (name) => <Text strong>{name || "N/A"}</Text>
    },
    {
      title: "Amenity",
      key: "amenity",
      onCell: nonGroupedOnCell,
      render: (_, record) => (
        <Space size="middle">
          {record.amenity?.iconUrl ? (
            <Avatar src={record.amenity.iconUrl} shape="square" size="large" />
          ) : (
            <Avatar shape="square" size="large" icon={<PictureOutlined />} />
          )}
          <Text strong>{record.amenity?.name}</Text>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      onCell: nonGroupedOnCell,
      render: (text) => text || <Text type="secondary" italic>No notes</Text>
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      onCell: nonGroupedOnCell,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm title="Remove Amenity" onConfirm={() => onDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data
        ?.sort((a, b) => (a.room?.roomNumber > b.room?.roomNumber ? 1 : -1))
        .map(item => ({ ...item, key: item.id }))
      }
      loading={loading}
      pagination={pagination}
      onChange={onTableChange}
      bordered
      components={{
        header: {
          cell: (props) => (
            <th {...props} style={{ ...props.style, backgroundColor: '#f0f2f5', fontWeight: 'bold', borderBottom: '2px solid #d9d9d9' }} />
          ),
        },
      }}
    />
  );
}