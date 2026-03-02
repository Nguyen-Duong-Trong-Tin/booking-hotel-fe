import React, { useState } from "react";
import { Button, Popconfirm, Tooltip } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { Button as AntButton } from "antd";

export default function AdminRoomDelete({ record, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Gọi hàm onDelete truyền từ index.jsx xuống
      await onDelete(record.id);
    } catch (error) {
      // Lỗi đã được index.jsx xử lý qua messageApi nên ở đây chỉ cần tắt loading
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popconfirm
      title="Delete Room"
      description={`Are you sure you want to delete room ${record.roomNumber}?`}
      onConfirm={handleConfirm}
      okText="Yes, Delete"
      cancelText="No"
      okButtonProps={{ danger: true, loading: loading }}
    >
      <Tooltip title="Delete room">
        <AntButton 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          loading={loading}
        />
      </Tooltip>
    </Popconfirm>
  );
}