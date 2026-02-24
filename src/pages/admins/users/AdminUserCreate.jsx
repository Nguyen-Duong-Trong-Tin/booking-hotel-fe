import { Form, Input, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { getRoles } from "../../../apis/roleApi";

export default function AdminUserCreate({ open, loading, onCancel, onSubmit }) {
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [fetchingRoles, setFetchingRoles] = useState(false);

    useEffect(() => {
        if (open) {
            form.resetFields();
            loadRoles();
        }
    }, [open, form]);

    const loadRoles = async () => {
        setFetchingRoles(true);
        try {
            const res = await getRoles({ page: 0, size: 100 });
            setRoles(res?.data?.items || []);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        } finally {
            setFetchingRoles(false);
        }
    };

    return (
        <Modal 
            title="Create New User" 
            open={open} 
            onCancel={onCancel} 
            onOk={() => form.submit()} 
            confirmLoading={loading}
            destroyOnHidden 
            okText="Create"
            cancelText="Cancel"
            width={550}
        >
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={onSubmit}
                scrollToFirstError
            >
                {/* Full Name */}
                <Form.Item 
                    label="Full Name" 
                    name="fullName" 
                    rules={[{ required: true, message: 'Please enter the full name!' }]}
                >
                    <Input placeholder="e.g., John Doe" />
                </Form.Item>

                {/* Email */}
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

                {/* Password */}
                <Form.Item 
                    label="Password" 
                    name="password" 
                    rules={[
                        { required: true, message: 'Please enter a password!' },
                        { min: 6, message: 'Password must be at least 6 characters long!' }
                    ]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>
                
                {/* Phone Number */}
                <Form.Item 
                    label="Phone Number" 
                    name="phone" 
                    rules={[
                        { required: true, message: 'Please enter the phone number!' },
                        { pattern: /^[0-9]+$/, message: 'Phone number must contain only digits!' }
                    ]}
                >
                    <Input placeholder="e.g., 0912345678" maxLength={15} />
                </Form.Item>
                
                {/* Role Selection  */}
                <Form.Item 
                    label="Role" 
                    name="roleId" 
                    rules={[{ required: true, message: 'Please select a user role!' }]}
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