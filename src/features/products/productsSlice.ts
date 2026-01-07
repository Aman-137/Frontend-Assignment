import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { mockApi } from "../../mock/api";

/* ===================== TYPES ===================== */

export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  rating: number;
  status: ProductStatus;
  updatedAt: string;
  isDeleted?: boolean; // 👈 ADD THIS
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

/* ===================== INITIAL STATE ===================== */

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

/* ===================== ASYNC THUNKS ===================== */

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    const products = await mockApi.getProducts();
    return products as Product[];
  }
);

/* ===================== SLICE ===================== */

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
    },

    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    toggleProductStatus(state, action: PayloadAction<string>) {
      const product = state.items.find((p) => p.id === action.payload);
      if (product) {
        product.status = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      }
    },

    softDeleteProduct(state, action: PayloadAction<string>) {
      const product = state.items.find((p) => p.id === action.payload);
      if (product) {
        product.isDeleted = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch products";
      });
  },
});

/* ===================== EXPORTS ===================== */

export const {
  addProduct,
  updateProduct,
  toggleProductStatus,
  softDeleteProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
