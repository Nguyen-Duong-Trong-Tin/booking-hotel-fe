import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function AdminPaymentDelete({ onConfirm, loading }) {
  return (
    <Popconfirm
      title="Delete Payment"
      description="Are you sure you want to delete this transaction? This action cannot be undone."
      onConfirm={onConfirm}
      okText="Yes"
      cancelText="No"
      okButtonProps={{ 
        danger: true, 
        loading: loading 
      }}
    >
      <Tooltip title="Delete">
        <Button 
          danger 
          variant="outlined" // Giữ viền đỏ chuẩn phong cách Rooms
          icon={<DeleteOutlined />} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }} 
        />
      </Tooltip>
    </Popconfirm>
  );
}