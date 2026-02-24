import { Modal, Typography } from "antd";

export default function AdminBookingDelete({ open, bookingData, onCancel, onConfirm }) {
  return (
    <Modal
      title="Confirm Delete"
      open={open}
      onCancel={onCancel}
      onOk={() => onConfirm(bookingData.id)}
      okButtonProps={{ danger: true }}
      okText="Delete"
      cancelText="Cancel"
    >
      <Typography.Text>
        Are you sure you want to delete the booking for customer: 
        <b style={{ marginLeft: 5 }}>{bookingData?.user?.fullName || "N/A"}</b>?
      </Typography.Text>
      <br />
      <Typography.Text type="secondary">
        This action cannot be undone.
      </Typography.Text>
    </Modal>
  );
}