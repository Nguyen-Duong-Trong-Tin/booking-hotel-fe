import { useEffect, useMemo, useState } from "react";
import { Button, Card, Space, Typography, message } from "antd";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from "../../../apis/categoryApi";
import AdminLayout from "../auth/AdminLayout";
import AdminCategoryCreate from "./AdminCategoryCreate";
import AdminCategoryUpdate from "./AdminCategoryUpdate";
import AdminCategorySearch from "./AdminCategorySearch";
import AdminCategoryList from "./AdminCategoryList";

const { Title, Text } = Typography;

const DEFAULT_PAGE_SIZE = 10;

export default function AdminCategoryPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [listLoading, setListLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ name: "", description: "" });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const pagination = useMemo(() => {
    return {
      current: page + 1,
      pageSize: size,
      total: totalPages * size,
      showSizeChanger: true
    };
  }, [page, size, totalPages]);

  const loadCategories = async (nextPage = page, nextSize = size, nextFilters = filters) => {
    setListLoading(true);

    try {
      const response = await getCategories({
        page: nextPage,
        size: nextSize,
        name: nextFilters.name,
        description: nextFilters.description
      });
      const spec = response?.data;

      setCategories(spec?.items || []);
      setPage(typeof spec?.page === "number" ? spec.page : 0);
      setSize(typeof spec?.size === "number" ? spec.size : nextSize);
      setTotalPages(typeof spec?.totalPages === "number" ? spec.totalPages : 0);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Failed to load categories");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleTableChange = (paginationConfig) => {
    const nextPage = paginationConfig.current - 1;
    const nextSize = paginationConfig.pageSize;

    setPage(nextPage);
    setSize(nextSize);
    loadCategories(nextPage, nextSize, filters);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsCreateOpen(false);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
  };

  const closeUpdateModal = () => {
    setEditingCategory(null);
  };

  const handleCreateFinish = async (values) => {
    setModalLoading(true);

    try {
      await createCategory({
        name: values.name,
        description: values.description
      });
      messageApi.success("Category created");
      closeCreateModal();
      loadCategories();
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      const apiMessage = error?.response?.data?.message;

      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        messageApi.error(apiErrors[0]);
      } else {
        messageApi.error(apiMessage || "Action failed");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateFinish = async (values) => {
    if (!editingCategory) {
      return;
    }

    setModalLoading(true);

    try {
      await updateCategory({
        id: editingCategory.id,
        name: values.name,
        description: values.description
      });
      messageApi.success("Category updated");
      closeUpdateModal();
      loadCategories();
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      const apiMessage = error?.response?.data?.message;

      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        messageApi.error(apiErrors[0]);
      } else {
        messageApi.error(apiMessage || "Action failed");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      messageApi.success("Category deleted");
      loadCategories();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleSearch = (nextFilters) => {
    setFilters(nextFilters);
    setPage(0);
    loadCategories(0, size, nextFilters);
  };

  const handleSearchReset = () => {
    const resetFilters = { name: "", description: "" };
    setFilters(resetFilters);
    setPage(0);
    loadCategories(0, size, resetFilters);
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Space direction="vertical" size={24} className="w-full">
        <div>
          <Title level={2} className="!mb-1">
            Categories
          </Title>
          <Text type="secondary">Create and manage categories.</Text>
        </div>

        <Card className="shadow-sm">
          <AdminCategorySearch
            filters={filters}
            onSearch={handleSearch}
            onReset={handleSearchReset}
          />
        </Card>

        <Card className="shadow-sm">
          <Space className="w-full justify-between" align="center">
            <Title level={4} className="!mb-0">
              Category list
            </Title>
            <Button type="primary" onClick={openCreateModal}>
              New category
            </Button>
          </Space>

          <AdminCategoryList
            categories={categories}
            loading={listLoading}
            pagination={pagination}
            onTableChange={handleTableChange}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </Card>
      </Space>

      <AdminCategoryCreate
        open={isCreateOpen}
        loading={modalLoading}
        onCancel={closeCreateModal}
        onSubmit={handleCreateFinish}
      />

      <AdminCategoryUpdate
        open={Boolean(editingCategory)}
        loading={modalLoading}
        category={editingCategory}
        onCancel={closeUpdateModal}
        onSubmit={handleUpdateFinish}
      />
    </AdminLayout>
  );
}
