export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      "="
    );
    const decoded = atob(paddedPayload);
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
};

export const getTokenRole = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.role !== "string") {
    return null;
  }

  return payload.role;
};
