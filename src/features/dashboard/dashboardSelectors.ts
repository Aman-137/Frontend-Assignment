import type { RootState } from "../../app/store";

/* ===================== PRODUCT METRICS ===================== */

export const selectTotalProducts = (state: RootState) =>
  state.products.items.filter((p) => !p.isDeleted).length;

export const selectActiveProducts = (state: RootState) =>
  state.products.items.filter((p) => p.status === "ACTIVE" && !p.isDeleted)
    .length;

/* ===================== ORDER METRICS ===================== */

export const selectTotalOrders = (state: RootState) =>
  state.orders.items.length;

export const selectPendingOrders = (state: RootState) =>
  state.orders.items.filter((o) => o.status === "PENDING").length;

export const selectRevenue = (state: RootState) =>
  state.orders.items
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, order) => sum + order.total, 0);
