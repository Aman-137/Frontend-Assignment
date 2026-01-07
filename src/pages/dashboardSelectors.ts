import type { RootState } from "../app/store";

/* -------- ORDERS PER DAY (LAST 7 DAYS) -------- */
export const selectOrdersPerDay = (state: RootState) => {
  const orders = state.orders.items;

  const daysMap: Record<string, number> = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    daysMap[date] = (daysMap[date] || 0) + 1;
  });

  return Object.entries(daysMap)
    .slice(-7)
    .map(([date, count]) => ({
      date,
      orders: count,
    }));
};

/* -------- ORDER STATUS DISTRIBUTION -------- */
export const selectOrderStatusStats = (state: RootState) => {
  const orders = state.orders.items;

  const stats = {
    PENDING: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };

  orders.forEach((order) => {
    stats[order.status]++;
  });

  return [
    { name: "Pending", value: stats.PENDING },
    { name: "Completed", value: stats.COMPLETED },
    { name: "Cancelled", value: stats.CANCELLED },
  ];
};
