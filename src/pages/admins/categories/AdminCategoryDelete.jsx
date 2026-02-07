import { Button, Popconfirm } from "antd";

export default function AdminCategoryDelete({ onConfirm }) {
  return (
    <Popconfirm
      title="Delete category"
      description="Are you sure you want to delete this category?"
      onConfirm={onConfirm}
    >
      <Button danger size="small">
        Delete
      </Button>
    </Popconfirm>
  );
}
