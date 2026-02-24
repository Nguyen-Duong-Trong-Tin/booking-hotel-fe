import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

export default function AdminAmenityUpdate({ open, loading, amenity, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  // Cập nhật giá trị vào form mỗi khi mở Modal hoặc đổi Amenity cần sửa
  useEffect(() => {
    if (open && amenity) {
      form.setFieldsValue({
        name: amenity.name,
        iconUrl: amenity.iconUrl
      });
    }
  }, [open, amenity, form]);

  const handleOk = () => {
    form.submit();
  };

  return (
    <Modal
      title="Update Amenity"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      okText="Save Changes"
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values);
        }}
      >
        <Form.Item
          label="Amenity Name"
          name="name"
          rules={[
            { required: true, message: "Name is not blank" },
            { max: 100, message: "Name maximum length is 100 characters" }
          ]}
        >
          <Input placeholder="Enter amenity name" />
        </Form.Item>

        <Form.Item
          label="Icon URL"
          name="iconUrl"
          rules={[
            { max: 255, message: "Icon url maximum length is 255 characters" }
          ]}
        >
          <Input placeholder="Enter icon or image URL" />
        </Form.Item>
      </Form>
    </Modal>
  );
}