import { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Space, Typography } from "antd";

const { Text } = Typography;
const QR_READER_ID = "booking-qr-reader";

export default function AdminBookingQrScanner({ open, onClose, onScan }) {
  const [manualValue, setManualValue] = useState("");
  const [error, setError] = useState("");
  const scannerRef = useRef(null);
  const handledRef = useRef(false);

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      await scanner.stop();
    } catch (err) {
      // ignore stop errors
    }
    try {
      await scanner.clear();
    } catch (err) {
      // ignore clear errors
    }
  };

  const handleDecoded = async (decodedText) => {
    if (handledRef.current) return;
    handledRef.current = true;
    await stopScanner();
    if (onScan) {
      onScan(decodedText);
    }
  };

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    handledRef.current = false;
    setManualValue("");
    setError("");

    let isActive = true;

    const startScanner = async () => {
      try {
        if (!window.isSecureContext && window.location.hostname !== "localhost") {
          setError("Camera access requires HTTPS or localhost.");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 0));

        const element = document.getElementById(QR_READER_ID);
        if (!element) {
          setError("Scanner failed to initialize. Please try again.");
          return;
        }

        const module = await import("html5-qrcode");
        if (!isActive) return;

        const scanner = new module.Html5Qrcode(QR_READER_ID);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 240 },
          handleDecoded,
          () => {}
        );
      } catch (err) {
        setError("Unable to access camera. You can enter the booking id manually.");
      }
    };

    startScanner();

    return () => {
      isActive = false;
      stopScanner();
      scannerRef.current = null;
    };
  }, [open]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Scan Booking QR"
      destroyOnClose
    >
      <div id={QR_READER_ID} style={{ width: "100%" }} />
      {error ? (
        <Text type="danger" className="block mt-2">
          {error}
        </Text>
      ) : null}
      <Space className="mt-4" style={{ width: "100%" }}>
        <Input
          placeholder="Enter booking id"
          value={manualValue}
          onChange={(event) => setManualValue(event.target.value)}
        />
        <Button
          type="primary"
          onClick={() => manualValue.trim() && onScan(manualValue.trim())}
        >
          Lookup
        </Button>
      </Space>
    </Modal>
  );
}
