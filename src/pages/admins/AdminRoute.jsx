import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { getAccessToken } from "../../apis/tokenStorage";

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const json = atob(padded);
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
};

export default function AdminRoute() {
  const location = useLocation();
  const token = getAccessToken();
  const [isChecking, setIsChecking] = useState(Boolean(token));
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsChecking(false);
      setIsAllowed(false);
      return;
    }

    const payload = decodeJwtPayload(token);
    const role = payload?.role;
    const normalizedRole = typeof role === "string" ? role.toUpperCase() : "";
    const hasAdminRole = normalizedRole === "ADMIN" || normalizedRole === "ROLE_ADMIN";
    setIsAllowed(hasAdminRole);
    setIsChecking(false);
  }, [token]);

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAllowed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
