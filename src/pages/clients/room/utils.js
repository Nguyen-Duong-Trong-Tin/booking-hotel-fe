export const getStatusColor = (status) => {
  if (status === "AVAILABLE") return "green";
  if (status === "OCCUPIED") return "blue";
  if (status === "MAINTENANCE") return "volcano";
  return "default";
};

export const formatPrice = (price) => {
  if (price === null || price === undefined) {
    return "N/A";
  }
  return `$${Number(price).toLocaleString()}`;
};
