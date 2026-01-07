import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { mockApi } from "../../mock/api";

/* ===================== TYPES ===================== */

const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

/* ---------- CART TYPE ---------- */

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

/* ===================== STATE ===================== */

interface OrdersState {
  items: Order[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;
}

/* ===================== INITIAL STATE ===================== */

const initialState: OrdersState = {
  items: [],
  cart: [],
  loading: false,
  error: null,
};

/* ===================== ASYNC THUNKS ===================== */

export const fetchOrders = createAsyncThunk<Order[]>(
  "orders/fetchOrders",
  async () => {
    const orders = await mockApi.getOrders();
    return orders as Order[];
  }
);

/* ===================== SLICE ===================== */

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    /* ---------- CART REDUCERS ---------- */

    addToCart(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const existing = state.cart.find(
        (item) => item.productId === action.payload.productId
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },

    updateCartQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const item = state.cart.find(
        (c) => c.productId === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.cart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
    },

    clearCart(state) {
      state.cart = [];
    },

    /* ---------- ORDER REDUCERS ---------- */

    createOrder(state, action: PayloadAction<{ customerName: string }>) {
      const newOrder: Order = {
        id: `o_${Date.now()}`,
        customerName: action.payload.customerName,
        items: state.cart,
        total: calculateTotal(state.cart),
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      state.items.unshift(newOrder);

      state.cart = [];
    },

    updateOrderStatus(
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>
    ) {
      const order = state.items.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch orders";
      });
  },
});

/* ===================== EXPORTS ===================== */

export const {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  createOrder,
  updateOrderStatus,
} = ordersSlice.actions;

export default ordersSlice.reducer;
