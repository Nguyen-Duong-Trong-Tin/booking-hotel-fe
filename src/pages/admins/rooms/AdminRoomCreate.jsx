import { Form, Input, InputNumber, Modal, Select } from "antd";

export default function AdminRoomCreate({ open, loading, categories, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  // Hàm xử lý reset và đóng modal khi cancel
  const handleCancel = () => {
    form.resetFields(); // Xóa sạch dữ liệu trong các ô input
    onCancel();
  };

  return (
    <Modal
      title="Create New Room"
      open={open}
      confirmLoading={loading}
      onCancel={handleCancel} // Sử dụng hàm handleCancel đã khai báo ở trên
      onOk={() => form.submit()}
      destroyOnClose // Giúp hủy bỏ component bên trong khi đóng modal
      okText="Create"
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields(); // Xóa trắng form sau khi submit thành công
        }}
        // Thiết lập các giá trị mặc định cho form mới
        initialValues={{
          status: "AVAILABLE",
          capacity: 1
        }}
      >
        <Form.Item 
          name="roomNumber" 
          label="Room Number" 
          rules={[{ required: true, message: "Please enter room number" }]}
        >
          <Input placeholder="e.g. 101" />
        </Form.Item>

        <Form.Item 
          name="categoryId" 
          label="Category" 
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select category">
            {categories.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="price" 
          label="Price" 
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber 
            className="w-full" 
            placeholder="Price"
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item 
          name="capacity" 
          label="Capacity" 
          rules={[{ required: true, message: "Please enter capacity" }]}
        >
          <InputNumber className="w-full" min={1} placeholder="Number of persons" />
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