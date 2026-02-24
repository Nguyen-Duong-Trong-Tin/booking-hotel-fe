import { useEffect, useMemo, useState } from "react";
import { Button, Card, Space, Typography, message } from "antd";
import { getUsers, createUser, updateUser, deleteUser } from "../../../apis/userApi";

import AdminLayout from "../auth/AdminLayout";
import AdminUserCreate from "./AdminUserCreate";
import AdminUserUpdate from "./AdminUserUpdate";
import AdminUserSearch from "./AdminUserSearch";
import AdminUserList from "./AdminUserList";

const { Title, Text } = Typography;
const DEFAULT_PAGE_SIZE = 10;

export default function AdminUserPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [listLoading, setListLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [users, setUsers] = useState([]); 
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  
  const [filters, setFilters] = useState({ 
    fullName: "", 
    email: "", 
    phone: "", 
    roleName: "" 
  });
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const pagination = useMemo(() => {
    return {
      current: page + 1,
      pageSize: size,
      total: (totalPages || 0) * size,
      showSizeChanger: true
    };
  }, [page, size, totalPages]);

  const loadUsers = async (nextPage = page, nextSize = size, nextFilters = filters) => {
    setListLoading(true);
    try {
      const response = await getUsers({
        page: nextPage,
        size: nextSize,
        fullName: nextFilters.fullName,
        email: nextFilters.email,
        phone: nextFilters.phone,
        roleName: nextFilters.roleName
      });
      
      const spec = response?.data;
      setUsers(spec?.items || []);
      setPage(spec?.page ?? 0);
      setSize(spec?.size ?? nextSize);
      setTotalPages(spec?.totalPages ?? 0);
    } catch (error) {
      console.error("API Error:", error);
      messageApi.error(error?.response?.data?.message || "Failed to load user list");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleTableChange = (paginationConfig) => {
    const nextPage = paginationConfig.current - 1;
    const nextSize = paginationConfig.pageSize;
    setPage(nextPage);
    setSize(nextSize);
    loadUsers(nextPage, nextSize, filters);
  };

  const handleCreateFinish = async (values) => {
    setModalLoading(true);
    try {
      await createUser(values);
      messageApi.success("User created successfully");
      setIsCreateOpen(false);
      loadUsers(0, size, filters); 
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Creation failed";
      const validationErrors = error?.response?.data?.errors;
      
      if (validationErrors) {
         messageApi.error(Object.values(validationErrors)[0]);
      } else {
         messageApi.error(errorMsg);
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateFinish = async (values) => {
    if (!editingUser) return;
    setModalLoading(true);
    try {
      await updateUser(editingUser.id, values);
      messageApi.success("User updated successfully");
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Update failed");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      messageApi.success("User deleted successfully");
      loadUsers();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Deletion failed");
    }
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Space direction="vertical" size={24} className="w-full">
        <div>
          <Title level={2} className="!mb-1">Users</Title>
          <Text type="secondary">Manage system users and their permissions.</Text>
        </div>

        <Card className="shadow-sm">
          <AdminUserSearch 
            filters={filters} 
            onSearch={(f) => { setFilters(f); setPage(0); loadUsers(0, size, f); }} 
            onReset={() => { 
                const r = {fullName:"", email:"", phone:"", roleName:""}; 
                setFilters(r); 
                setPage(0);
                loadUsers(0, size, r); 
            }} 
          />
        </Card>

        <Card className="shadow-sm">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} className="!mb-0">User list</Title>
            <Button type="primary" onClick={() => setIsCreateOpen(true)}>
              New user
            </Button>
          </div>
          <AdminUserList
            users={users}
            loading={listLoading}
            pagination={pagination}
            onTableChange={handleTableChange}
            onEdit={setEditingUser}
            onDelete={handleDelete}
          />
        </Card>
      </Space>

      <AdminUserCreate
        open={isCreateOpen}
        loading={modalLoading}
        onCancel={() => setIsCreateOpen(false)}
        onSubmit={handleCreateFinish}
      />

      <AdminUserUpdate
        open={Boolean(editingUser)}
        loading={modalLoading}
        user={editingUser}
        onCancel={() => setEditingUser(null)}
        onSubmit={handleUpdateFinish}
      />
    </AdminLayout>
  );
}