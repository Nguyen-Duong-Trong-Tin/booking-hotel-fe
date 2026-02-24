import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";

export default function AdminRoomUpdate({ open, loading, room, categories, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && room) {
      form.setFieldsValue({
        roomNumber: room.roomNumber,
        price: room.price,
        capacity: room.capacity,
        status: room.status,
        categoryId: room.category?.id, // Lấy ID từ object category trả về
      });
    }
  }, [open, room, form]);

  return (
    <Modal
      title="Update Room Information"
      open={open}
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
      okText="Save Changes"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item 
          name="roomNumber" 
          label="Room Number" 
          rules={[{ required: true, message: "Room number is not blank" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
          <Select placeholder="Select category">
            {categories.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber 
            className="w-full" 
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item name="capacity" label="Capacity" rules={[{ required: true }]}>
          <InputNumber className="w-full" min={1} />
        </Form.Item>

        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="AVAILABLE">Available</Select.Option>
            <Select.Option value="OCCUPIED">Occupied</Select.Option>
            <Select.Option value="MAINTENANCE">Maintenance</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}