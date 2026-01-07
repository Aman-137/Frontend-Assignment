import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  updateCartQuantity,
  removeFromCart,
} from "../features/orders/ordersSlice";
import { createOrder } from "../features/orders/ordersSlice";

const Cart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.orders.cart);

  if (cart.length === 0) {
    return <p className="text-white">Cart is empty</p>;
  }

  return (
    <div>
      <h1 className="text-2xl text-white font-semibold mb-4">Cart</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Product</th>
            <th className="p-2">Price</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item) => (
            <tr key={item.productId} className="border-t">
              <td className="p-2 text-white">{item.name}</td>
              <td className="p-2 text-white text-center">₹{item.price}</td>

              <td className="p-2 text-center">
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() =>
                      dispatch(
                        updateCartQuantity({
                          productId: item.productId,
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      )
                    }
                    className="px-2 py-1 bg-gray-600 text-white rounded"
                  >
                    −
                  </button>

                  <span className="text-white">{item.quantity}</span>

                  <button
                    onClick={() =>
                      dispatch(
                        updateCartQuantity({
                          productId: item.productId,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                    className="px-2 py-1 bg-gray-600 text-white rounded"
                  >
                    +
                  </button>
                </div>
              </td>

              <td className="p-2 text-center">
                <button
                  onClick={() => dispatch(removeFromCart(item.productId))}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          dispatch(
            createOrder({
              customerName: "Test Customer",
            })
          );
          toast.success("Order has been Placed!");
        }}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded"
      >
        Place Order
      </button>
    </div>
  );
};

export default Cart;
