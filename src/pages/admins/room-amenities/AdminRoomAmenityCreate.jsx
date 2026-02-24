import { Form, Input, Modal, Select, Tag } from "antd";

export default function AdminRoomAmenityCreate({ open, loading, rooms, amenities, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  // Custom renderer for selected tags to make the UI look cleaner
  const tagRender = (props) => {
    const { label, closable, onClose } = props;
    return (
      <Tag
        color="blue"
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, marginTop: 2, marginBottom: 2 }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <Modal
      title="Assign Multiple Amenities"
      open={open}
      confirmLoading={loading}
      onCancel={() => { 
        form.resetFields(); 
        onCancel(); 
      }}
      onOk={() => form.submit()}
      okText="Assign All"
      width={600}
      destroyOnClose
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields();
        }}
      >
        <Form.Item 
          name="roomId" 
          label="Select Room" 
          rules={[{ required: true, message: "Please select a room" }]}
        >
          <Select 
            placeholder="Choose a room" 
            showSearch 
            optionFilterProp="children"
          >
            {rooms.map(r => (
              <Select.Option key={r.id} value={r.id}>
                Room {r.roomNumber}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="amenityIds" 
          label="Select Amenities" 
          rules={[{ required: true, message: "Please select at least one amenity" }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="You can select multiple amenities"
            tagRender={tagRender}
            style={{ width: '100%' }}
            optionFilterProp="children"
          >
            {amenities.map(a => (
              <Select.Option key={a.id} value={a.id}>
                {a.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Note / Description for these items">
          <Input.TextArea 
            rows={3} 
            placeholder="e.g. All items are in premium condition..." 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}