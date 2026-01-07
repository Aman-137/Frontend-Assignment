import { Fragment, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { updateOrderStatus } from "../features/orders/ordersSlice";
import { usePagination } from "../hooks/usePagination";

const Orders = () => {
  const { items } = useAppSelector((state) => state.orders);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "COMPLETED" | "CANCELLED"
  >("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") return items;
    return items.filter((order) => order.status === statusFilter);
  }, [items, statusFilter]);

  const { currentPage, totalPages, setCurrentPage, paginatedData } =
    usePagination(filteredOrders, 10);

  if (items.length === 0) {
    return <p className="text-white">No orders found</p>;
  }

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div>
      <h1 className="text-2xl text-white font-semibold mb-4">Orders</h1>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className="px-3 py-2 border rounded"
        >
          <option value="ALL">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <p className="text-xs text-yellow-200 mb-2 md:hidden mb-4">
        ← Swipe left/right to see more →
      </p>

      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="w-full min-w-[900px] border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((order) => (
              <Fragment key={order.id}>
                {/* MAIN ORDER ROW */}
                <tr className="border-t">
                  <td className="p-2 text-white">{order.id}</td>

                  <td className="p-2 text-white text-center">
                    {order.customerName}
                  </td>

                  <td className="p-2 text-white text-center">₹{order.total}</td>

                  <td className="p-2 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full
              ${
                order.status === "PENDING"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : order.status === "COMPLETED"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-2 text-white text-center">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td className="p-2 text-center space-x-2">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    >
                      {expandedOrderId === order.id ? "Hide" : "View"}
                    </button>

                    {order.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            dispatch(
                              updateOrderStatus({
                                id: order.id,
                                status: "COMPLETED",
                              })
                            )
                          }
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                        >
                          Complete
                        </button>

                        <button
                          onClick={() =>
                            dispatch(
                              updateOrderStatus({
                                id: order.id,
                                status: "CANCELLED",
                              })
                            )
                          }
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>

                {/* EXPANDED ORDER DETAILS ROW (ADDED PART) */}
                {expandedOrderId === order.id && (
                  <tr className="bg-gray-800">
                    <td colSpan={6} className="p-4">
                      <div className="border rounded p-3">
                        <h3 className="text-white font-semibold mb-2">
                          Order Items
                        </h3>

                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-300">
                              <th className="text-left p-1">Product</th>
                              <th className="text-center p-1">Price</th>
                              <th className="text-center p-1">Qty</th>
                              <th className="text-center p-1">Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.productId} className="border-t">
                                <td className="p-1 text-white">{item.name}</td>
                                <td className="p-1 text-center text-white">
                                  ₹{item.price}
                                </td>
                                <td className="p-1 text-center text-white">
                                  {item.quantity}
                                </td>
                                <td className="p-1 text-center text-white">
                                  ₹{item.price * item.quantity}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 text-white"
          >
            Prev
          </button>

          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
