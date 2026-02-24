import { Button, Popconfirm } from "antd";
export default function AdminUserDelete({ onConfirm, loading }) {
  return (
    <Popconfirm
      title="Delete User"
      description="Are you sure you want to delete this user? This action cannot be undone."
      onConfirm={onConfirm}
      okText="Yes, Delete"
      cancelText="No"
      okButtonProps={{ 
        danger: true, 
        loading: loading 
      }}
    >
      <Button danger size="small">
        Delete
      </Button>
    </Popconfirm>
  );
}