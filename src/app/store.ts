import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import ordersReducer from "../features/orders/ordersSlice";
import { loadState, saveState } from "../utils/persist";

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
  },
  preloadedState: {
    products: persistedState?.products,
    orders: persistedState?.orders ?? {
      items: [],
      cart: [],
      loading: false,
      error: null,
    },
  },
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
