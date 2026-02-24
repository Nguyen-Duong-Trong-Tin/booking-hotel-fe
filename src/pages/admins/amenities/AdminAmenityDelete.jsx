import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function AdminAmenityDelete({ onConfirm }) {
  return (
    <Popconfirm
      title="Delete this amenity?"
      description="This action cannot be undone."
      onConfirm={onConfirm}
      okText="Yes"
      cancelText="No"
      okButtonProps={{ danger: true }}
    >
      <Button 
        danger 
        icon={<DeleteOutlined />} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }} 
      />
    </Popconfirm>
  );
}