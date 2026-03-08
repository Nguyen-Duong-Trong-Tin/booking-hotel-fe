import { Table, Space, Avatar, Tag, Typography, Tooltip } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function AdminRoomAmenityList({ data, loading, onTableChange, onDelete }) {
  
  // --- LOGIC GỘP DỮ LIỆU (Giữ nguyên) ---
  const groupedData = Object.values(
    (data || []).reduce((acc, item) => {
      const roomId = item.room?.id;
      if (!acc[roomId]) {
        acc[roomId] = {
          key: roomId,
          room: item.room,
          amenitiesList: [],
        };
      }
      acc[roomId].amenitiesList.push({
        relationId: item.id,
        name: item.amenity?.name,
        icon: item.amenity?.iconUrl,
        description: item.description
      });
      return acc;
    }, {})
  ).sort((a, b) => {
    const catCompare = (a.room?.category?.name || "").localeCompare(b.room?.category?.name || "");
    if (catCompare !== 0) return catCompare;
    return (a.room?.roomNumber || "").localeCompare(b.room?.roomNumber || "", undefined, { numeric: true });
  });

  const columns = [
    {
      title: "Room Number",
      key: "roomNumber",
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '15px', color: '#1890ff' }}>
            Room {record.room?.roomNumber}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.room?.category?.name}
          </Text>
        </Space>
      ),
    },
    {
      title: "Assigned Amenities",
      key: "amenities",
      render: (_, record) => (
        <Space wrap size={[8, 8]}>
          {record.amenitiesList.map((amt) => (
            <Tooltip title={amt.description || "No description"} key={amt.relationId}>
              <Tag 
                closable 
                onClose={(e) => {
                  e.preventDefault();
                  onDelete(amt.relationId);
                }}
                icon={amt.icon ? <Avatar src={amt.icon} size={14} /> : <AppstoreOutlined />}
                style={{ 
                  padding: '4px 10px', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center',
                  backgroundColor: '#f0f5ff',
                  border: '1px solid #adc6ff'
                }}
              >
                {amt.name}
              </Tag>
            </Tooltip>
          ))}
          {record.amenitiesList.length === 0 && (
            <Text type="secondary" italic>No amenities assigned</Text>
          )}
        </Space>
      ),
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={groupedData}
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        position: ['bottomRight']
      }}
      onChange={onTableChange}
      bordered
    />
  );
}