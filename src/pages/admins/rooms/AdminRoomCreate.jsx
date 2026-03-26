import { Form, Image, Input, InputNumber, Modal, Select, Upload } from "antd";
import { PlusOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

const DEFAULT_CENTER = { lat: 16.0471, lng: 108.2062 };
const redFlagIcon = L.divIcon({
  html: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6z" fill="#ef4444"/><circle cx="12" cy="8" r="2.5" fill="white"/></svg>',
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click: (event) => {
      onPick({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });

  return null;
};

export default function AdminRoomCreate({ open, loading, categories, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [presentativeUid, setPresentativeUid] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [marker, setMarker] = useState(null);
  const latitude = Form.useWatch("latitude", form);
  const longitude = Form.useWatch("longitude", form);

  // Hàm xử lý reset và đóng modal khi cancel
  const handleCancel = () => {
    form.resetFields(); // Xóa sạch dữ liệu trong các ô input
    setFileList([]);
    setPresentativeUid(null);
    setMarker(null);
    onCancel();
  };

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return;
    }
    setMarker({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

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

  const renderUploadItem = (originNode, file) => {
    const isPresentative = file.uid === presentativeUid;
    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        {originNode}
        <button
          type="button"
          onClick={(event) => {
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

  return (
    <>
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
            onSubmit({ ...values, images: fileList, presentativeUid });
            form.resetFields(); // Xóa trắng form sau khi submit thành công
            setFileList([]);
            setPresentativeUid(null);
            setMarker(null);
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

        <Form.Item name="latitude" label="Latitude">
          <InputNumber className="w-full" placeholder="e.g. 16.0471" step={0.0001} />
        </Form.Item>

        <Form.Item name="longitude" label="Longitude">
          <InputNumber className="w-full" placeholder="e.g. 108.2062" step={0.0001} />
        </Form.Item>

        <div className="mb-4">
          <p className="mb-2 text-xs text-slate-500">Pick location on map</p>
          <div className="h-56 overflow-hidden rounded-xl border border-slate-200">
            <MapContainer
              center={marker ? [marker.lat, marker.lng] : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
              zoom={6}
              minZoom={4}
              className="h-full w-full"
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler
                onPick={(point) => {
                  setMarker(point);
                  form.setFieldsValue({ latitude: point.lat, longitude: point.lng });
                }}
              />
              {marker ? (
                <Marker position={[marker.lat, marker.lng]} icon={redFlagIcon} />
              ) : null}
            </MapContainer>
          </div>
        </div>

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