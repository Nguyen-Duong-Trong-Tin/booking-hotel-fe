import { Form, Input, Modal, Select, Tag } from "antd";
import { useEffect, useState } from "react";

export default function AdminRoomAmenityCreate({ 
  open, 
  loading, 
  rooms, 
  amenities, 
  onCancel, 
  onSubmit,
  roomAmenitiesData 
}) {
  const [form] = Form.useForm();
  const [existingIds, setExistingIds] = useState([]);

  // Watch the roomId field
  const selectedRoomId = Form.useWatch("roomId", form);

  // 1. Reset when open
  useEffect(() => {
    if (open) {
      form.resetFields();
      setExistingIds([]);
    }
  }, [open, form]);

  // 2. Logic: Show existing amenities and store them to a state for comparison
  useEffect(() => {
    if (open && selectedRoomId) {
      const currentIds = roomAmenitiesData
        ?.filter((item) => item.room?.id === selectedRoomId)
        .map((item) => item.amenity?.id);

      setExistingIds(currentIds || []); // Store "old" IDs
      form.setFieldsValue({
        amenityIds: currentIds || [],
      });
    } else {
      form.setFieldsValue({ amenityIds: [] });
      setExistingIds([]);
    }
  }, [selectedRoomId, open, roomAmenitiesData, form]);

  const onFinish = (values) => {
    // LOGIC: Filter only NEW amenities that are NOT in the existingIds list
    const onlyNewIds = values.amenityIds.filter(id => !existingIds.includes(id));
    
    if (onlyNewIds.length === 0) {
      Modal.info({ title: "No changes", content: "All selected amenities are already assigned to this room." });
      return;
    }

    // Submit only the truly new ones
    onSubmit({
      ...values,
      amenityIds: onlyNewIds
    });
  };

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    // Highlight existing ones with a different color (optional)
    const isExisting = existingIds.includes(value);
    return (
      <Tag 
        color={isExisting ? "default" : "blue"} 
        closable={closable} 
        onClose={onClose} 
        style={{ marginRight: 3 }}
      >
        {label} {isExisting ? "(Existing)" : "(New)"}
      </Tag>
    );
  };

  return (
    <Modal
      title="Assign New Amenities"
      open={open}
      confirmLoading={loading}
      onCancel={() => { form.resetFields(); onCancel(); }}
      onOk={() => form.submit()}
      okText="Add New Only"
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item 
          name="roomId" 
          label="Select Room" 
          rules={[{ required: true, message: "Please select a room!" }]}
        >
          <Select placeholder="Select a room..." showSearch allowClear optionFilterProp="children">
            {rooms.map(r => (
              <Select.Option key={r.id} value={r.id}>
                Room {r.roomNumber} - {r.category?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="amenityIds" 
          label="Amenities" 
          extra="Existing amenities are shown. Only newly added items will be processed."
          rules={[{ required: true, message: "Please select at least one amenity!" }]}
        >
          <Select
            mode="multiple"
            allowClear
            tagRender={tagRender}
            placeholder="Select amenities..."
            style={{ width: '100%' }}
            optionFilterProp="children"
          >
            {amenities.map(a => (
              <Select.Option key={a.id} value={a.id}>{a.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Internal Note">
          <Input.TextArea rows={2} placeholder="Note for the new assignments..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}