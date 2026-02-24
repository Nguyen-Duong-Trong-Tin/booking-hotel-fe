import { Form, Input, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { getRoles } from "../../../apis/roleApi";

export default function AdminUserUpdate({ open, loading, user, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [fetchingRoles, setFetchingRoles] = useState(false);

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roleId: user.role?.id 
      });
      loadRoles();
    }
  }, [open, user, form]);

  const loadRoles = async () => {
    setFetchingRoles(true);
    try {
      const res = await getRoles({ page: 0, size: 100 });
      setRoles(res?.data?.items || []);
    } catch (error) {
      console.error("Failed to load roles:", error);
    } finally {
      setFetchingRoles(false);
    }
  };

  return (
    <Modal
      title="Update User Information"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Save Changes"
      cancelText="Cancel"
      destroyOnHidden 
      width={550}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onSubmit}
        scrollToFirstError
      >
        {/* Full Name Field */}
        <Form.Item 
          label="Full Name" 
          name="fullName" 
          rules={[{ required: true, message: 'Please enter the full name!' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item 
          label="Email Address" 
          name="email" 
          rules={[
            { required: true, message: 'Please enter the email address!' },
            { type: 'email', message: 'Please enter a valid email address!' }
          ]}
        >
          <Input placeholder="example@domain.com" />
        </Form.Item>

        {/* Phone Number Field */}
        <Form.Item 
          label="Phone Number" 
          name="phone" 
          rules={[
            { required: true, message: 'Please enter the phone number!' },
            { pattern: /^[0-9]+$/, message: 'Phone number must contain only digits!' }
          ]}
        >
          <Input placeholder="e.g., 0912345678" />
        </Form.Item>

        {/* Password Field (Optional for Update) */}
        <Form.Item 
          label="New Password" 
          name="password" 
          extra="Leave blank if you do not want to change the password."
          rules={[{ min: 6, message: 'Password must be at least 6 characters!' }]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        {/* Role Selection Field */}
        <Form.Item 
          label="User Role" 
          name="roleId" 
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select 
            placeholder="Select a role" 
            loading={fetchingRoles}
            allowClear
          >
            {roles.map(r => (
              <Select.Option key={r.id} value={r.id}>
                {r.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}