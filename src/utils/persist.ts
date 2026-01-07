const STORAGE_KEY = "admin-dashboard-state";

export const loadState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return undefined;

    const parsed = JSON.parse(data);

    return {
      products: parsed.products,
      orders: {
        items: parsed.orders?.items ?? [],
        cart: parsed.orders?.cart ?? [], // ✅ FORCE CART
        loading: false,
        error: null,
      },
    };
  } catch {
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    const persistData = {
      products: state.products,
      orders: state.orders,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistData));
  } catch {}
};
