export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(amount);

export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

export const daysUntil = (date: string) => {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getStockStatus = (
  stock: number,
  minStock: number
): "ok" | "low" | "out" => {
  if (stock === 0) return "out";
  if (stock <= minStock) return "low";
  return "ok";
};

export const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-KE").format(n);
