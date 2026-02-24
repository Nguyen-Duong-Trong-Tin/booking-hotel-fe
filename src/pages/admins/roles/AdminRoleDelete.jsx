import { Button, Popconfirm } from "antd";

export default function AdminRoleDelete({ onConfirm }) {
  return (
    <Popconfirm
      title="Delete role"
      description="Are you sure you want to delete this role?"
      onConfirm={onConfirm}
    >
      <Button danger size="small">
        Delete
      </Button>
    </Popconfirm>
  );
}
