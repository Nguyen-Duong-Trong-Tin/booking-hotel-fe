import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";

export default function AdminRoomAmenityUpdate({ open, loading, rooms, amenities, initialValues, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  // Đổ dữ liệu vào form khi mở modal chỉnh sửa
  useEffect(() => {
    if (initialValues && open) {
      form.setFieldsValue({
        roomId: initialValues.room?.id,
        amenityId: initialValues.amenity?.id,
        description: initialValues.description,
      });
    }
  }, [initialValues, open, form]);

  return (
    <Modal
      title="Update Room Amenity"
      open={open}
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
      okText="Update"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item 
          name="roomId" 
          label="Room" 
          rules={[{ required: true, message: "Please select a room" }]}
        >
          <Select placeholder="Select room">
            {rooms.map(r => (
              <Select.Option key={r.id} value={r.id}>Room {r.roomNumber}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="amenityId" 
          label="Amenity" 
          rules={[{ required: true, message: "Please select an amenity" }]}
        >
          <Select placeholder="Select amenity">
            {amenities.map(a => (
              <Select.Option key={a.id} value={a.id}>{a.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="description" 
          label="Description"
          rules={[{ max: 255, message: "Maximum 255 characters" }]}
        >
          <Input.TextArea rows={3} placeholder="Specific notes for this room's amenity" />
        </Form.Item>
      </Form>
    </Modal>
  );
}