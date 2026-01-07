import productsData from "./products.json";
import ordersData from "./orders.json";

const randomDelay = () =>
  new Promise((res) => setTimeout(res, 300 + Math.random() * 500));

export const mockApi = {
  async getProducts() {
    await randomDelay();
    return [...productsData];
  },

  async getOrders() {
    await randomDelay();
    return [...ordersData];
  },
};
