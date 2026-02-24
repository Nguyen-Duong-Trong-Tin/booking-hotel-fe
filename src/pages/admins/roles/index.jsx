import { useEffect, useMemo, useState } from "react";
import { Button, Card, Space, Typography, message } from "antd";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole
} from "../../../apis/roleApi";
import AdminLayout from "../auth/AdminLayout";
import AdminRoleCreate from "./AdminRoleCreate";
import AdminRoleUpdate from "./AdminRoleUpdate";
import AdminRoleSearch from "./AdminRoleSearch";
import AdminRoleList from "./AdminRoleList";

const { Title, Text } = Typography;
const DEFAULT_PAGE_SIZE = 10;

export default function AdminRolePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [listLoading, setListLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ name: "", description: "" });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const pagination = useMemo(() => {
    return {
      current: page + 1,
      pageSize: size,
      total: (totalPages || 0) * size,
      showSizeChanger: true
    };
  }, [page, size, totalPages]);

  const loadRoles = async (nextPage = page, nextSize = size, nextFilters = filters) => {
    setListLoading(true);
    try {
      const response = await getRoles({
        page: nextPage,
        size: nextSize,
        name: nextFilters.name,
        description: nextFilters.description
      });
      const spec = response?.data;

      setRoles(spec?.items || []);
      setPage(typeof spec?.page === "number" ? spec.page : 0);
      setSize(typeof spec?.size === "number" ? spec.size : nextSize);
      setTotalPages(typeof spec?.totalPages === "number" ? spec.totalPages : 0);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Failed to load roles");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleTableChange = (paginationConfig) => {
    const nextPage = paginationConfig.current - 1;
    const nextSize = paginationConfig.pageSize;
    setPage(nextPage);
    setSize(nextSize);
    loadRoles(nextPage, nextSize, filters);
  };

  const openCreateModal = () => {
    setEditingRole(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setIsCreateOpen(false);
  };

  const closeCreateModal = () => setIsCreateOpen(false);
  const closeUpdateModal = () => setEditingRole(null);

  const handleCreateFinish = async (values) => {
    setModalLoading(true);
    try {
      await createRole({
        name: values.name,
        description: values.description
      });
      messageApi.success("Role created successfully");
      closeCreateModal();
      loadRoles();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Creation failed");
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateFinish = async (values) => {
    if (!editingRole) return;
    setModalLoading(true);
    try {
      await updateRole({
        id: editingRole.id,
        name: values.name,
        description: values.description
      });
      messageApi.success("Role updated successfully");
      closeUpdateModal();
      loadRoles();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Update failed");
    } finally {
      setModalLoading(false);
    }
  };

  // --- PHẦN CHỈNH SỬA CHÍNH: XỬ LÝ LỖI XÓA KHI CÓ NGƯỜI DÙNG ---
  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      messageApi.success("Role deleted successfully");
      loadRoles();
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409 || status === 500) {
        messageApi.error("Cannot delete: This role is still assigned to some users.");
      } else {
        messageApi.error(error?.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleSearch = (nextFilters) => {
    setFilters(nextFilters);
    setPage(0);
    loadRoles(0, size, nextFilters);
  };

  const handleSearchReset = () => {
    const resetFilters = { name: "", description: "" };
    setFilters(resetFilters);
    setPage(0);
    loadRoles(0, size, resetFilters);
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Space direction="vertical" size={24} className="w-full">
        <div>
          <Title level={2} className="!mb-1">Roles</Title>
          <Text type="secondary">Create and manage roles for the council management system.</Text>
        </div>

        <Card className="shadow-sm">
          <AdminRoleSearch
            filters={filters}
            onSearch={handleSearch}
            onReset={handleSearchReset}
          />
        </Card>

        <Card className="shadow-sm">
          <Space className="w-full justify-between" align="center" style={{ marginBottom: 16 }}>
            <Title level={4} className="!mb-0">Role list</Title>
            <Button type="primary" onClick={openCreateModal}>
              New role
            </Button>
          </Space>

          <AdminRoleList
            roles={roles}
            loading={listLoading}
            pagination={pagination}
            onTableChange={handleTableChange}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </Card>
      </Space>

      <AdminRoleCreate
        open={isCreateOpen}
        loading={modalLoading}
        onCancel={closeCreateModal}
        onSubmit={handleCreateFinish}
      />

      <AdminRoleUpdate
        open={Boolean(editingRole)}
        loading={modalLoading}
        role={editingRole} 
        onCancel={closeUpdateModal}
        onSubmit={handleUpdateFinish}
      />
    </AdminLayout>
  );
}