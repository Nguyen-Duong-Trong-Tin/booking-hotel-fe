import { Form, Image, Input, InputNumber, Modal, Select, Upload, message } from "antd";
import { PlusOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { deleteRoomImage, setRoomImagePresentative } from "../../../apis/roomImageApi";

export default function AdminRoomUpdate({ open, loading, room, categories, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [presentativeUid, setPresentativeUid] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    if (open && room) {
      form.setFieldsValue({
        roomNumber: room.roomNumber,
        price: room.price,
        capacity: room.capacity,
        status: room.status,
        categoryId: room.category?.id, // Lấy ID từ object category trả về
      });

      const existingImages = (room.roomImages || []).map((image) => ({
        uid: `existing-${image.id}`,
        name: `room-image-${image.id}`,
        status: "done",
        url: image.url,
        isPresentative: image.isPresentative,
        existing: true,
        id: image.id
      }));

      setFileList(existingImages);
      setPresentativeUid(null);
    }
  }, [open, room, form]);

  useEffect(() => {
    if (!open) {
      setFileList([]);
      setPresentativeUid(null);
    }
  }, [open]);

  const handleFileChange = ({ fileList: nextFileList }) => {
    if (presentativeUid && !nextFileList.some((item) => item.uid === presentativeUid)) {
      setPresentativeUid(null);
    }
    setFileList(nextFileList);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    let src = file.url || file.preview;

    if (!src && file.originFileObj) {
      src = await getBase64(file.originFileObj);
      file.preview = src;
    }

    setPreviewImage(src || "");
    setPreviewOpen(true);
    setPreviewTitle(file.name || "Preview");
  };

  const handleSetPresentativeExisting = async (file, event) => {
    event.stopPropagation();
    if (!file?.id) {
      return;
    }

    try {
      await setRoomImagePresentative(file.id);
      setFileList((current) =>
        current.map((item) => ({
          ...item,
          isPresentative: item.existing ? item.id === file.id : item.isPresentative
        }))
      );
      setPresentativeUid(null);
      message.success("Presentative image updated");
    } catch (error) {
      message.error("Failed to update presentative image");
    }
  };

  const renderUploadItem = (originNode, file) => {
    const isPresentative = file.existing ? file.isPresentative : file.uid === presentativeUid;
    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        {originNode}
        <button
          type="button"
          onClick={(event) => {
            if (file.existing) {
              handleSetPresentativeExisting(file, event);
              return;
            }

            event.stopPropagation();
            setPresentativeUid(file.uid);
          }}
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "none",
            background: "#ffffff",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3
          }}
          aria-label="Set as presentative"
        >
          {isPresentative ? (
            <StarFilled style={{ color: "#faad14", fontSize: 14 }} />
          ) : (
            <StarOutlined style={{ color: "#8c8c8c", fontSize: 14 }} />
          )}
        </button>
      </div>
    );
  };

  const handleRemove = async (file) => {
    if (!file?.existing || !file?.id) {
      return true;
    }

    try {
      await deleteRoomImage(file.id);
      message.success("Image deleted");
      return true;
    } catch (error) {
      message.error("Failed to delete image");
      return false;
    }
  };

  return (
    <>
      <Modal
        title="Update Room Information"
        open={open}
        confirmLoading={loading}
        onCancel={onCancel}
        onOk={() => form.submit()}
        destroyOnClose
        okText="Save Changes"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) =>
            onSubmit({
              ...values,
              images: fileList.filter((item) => !item.existing),
              presentativeUid
            })
          }
        >
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

        <Form.Item label="Images">
          <Upload
            listType="picture-card"
            accept="image/*"
            multiple
            maxCount={5}
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleFileChange}
            onPreview={handlePreview}
            onRemove={handleRemove}
            itemRender={renderUploadItem}
          >
            <div
              style={{
                width: 96,
                height: 96,
                border: "1px dashed #1677ff",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#1677ff",
                background: "#f0f7ff"
              }}
            >
              <PlusOutlined style={{ fontSize: 22 }} />
              <div style={{ marginTop: 6, fontWeight: 600 }}>Add</div>
            </div>
          </Upload>
        </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <Image alt={previewTitle} src={previewImage} style={{ width: "100%" }} />
      </Modal>
    </>
  );
}