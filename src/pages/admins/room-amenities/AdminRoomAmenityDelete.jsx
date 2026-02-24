import { Modal, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function AdminRoomAmenityDelete({ open, loading, record, onCancel, onConfirm }) {
  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
          Confirm Deletion
        </span>
      }
      open={open}
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={() => onConfirm(record.id)}
      okText="Remove Amenity"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
      destroyOnClose
    >
      <div className="py-2">
        <p>Are you sure you want to remove this amenity assignment?</p>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mt-3">
          <div className="mb-1">
            <Text strong>Room: </Text>
            <Text>{record?.room?.roomNumber}</Text>
          </div>
          <div>
            <Text strong>Amenity: </Text>
            <Text>{record?.amenity?.name}</Text>
          </div>
        </div>
        <p className="mt-3 text-gray-500 text-sm italic">
          * This action will only remove the amenity from this specific room.
        </p>
      </div>
    </Modal>
  );
}