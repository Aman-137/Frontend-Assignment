import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchProducts,
  toggleProductStatus,
  softDeleteProduct,
} from "../features/products/productsSlice";
import { useDebounce } from "../hooks/useDebounce";
import { usePagination } from "../hooks/usePagination";
import { Link } from "react-router-dom";
import { addToCart } from "../features/orders/ordersSlice";
import toast from "react-hot-toast";

const Products = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("updatedAt");

  // const cart = useAppSelector((state) => state.orders.cart);
  // console.log("CART:", cart);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((p) => p.category))),
    [items]
  );

  const filteredProducts = useMemo(() => {
    let data = items.filter((p) => !p.isDeleted);

    if (debouncedSearch) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter((p) => p.status === statusFilter);
    }

    if (categoryFilter !== "ALL") {
      data = data.filter((p) => p.category === categoryFilter);
    }

    if (sortBy === "price") {
      data.sort((a, b) => a.price - b.price);
    } else {
      data.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return data;
  }, [items, debouncedSearch, statusFilter, categoryFilter, sortBy]);

  const { currentPage, totalPages, setCurrentPage, paginatedData } =
    usePagination(filteredProducts, 10);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="">
      <h1 className="text-2xl text-white font-semibold mb-4">Products</h1>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Left controls */}
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded w-full sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="updatedAt">Sort by Updated</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        {/* Create product button */}
        <Link
          to="/products/new"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap"
        >
          + Create Product
        </Link>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-2 text-white">{product.name}</td>
                <td className="p-2 text-white text-center">₹{product.price}</td>
                <td className="p-2 text-white text-center">
                  {product.category}
                </td>
                <td className="p-2 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full
                      ${
                        product.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="p-2 text-white text-center space-x-2">
                  <button
                    onClick={() => {
                      dispatch(
                        addToCart({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                        })
                      );

                      toast.success(`"${product.name}" added to cart 🛒`);
                    }}
                    className="px-2 py-1 bg-yellow-500 text-black rounded text-sm"
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => dispatch(toggleProductStatus(product.id))}
                    className="px-2 py-1 bg-[#39f0d8] text-black rounded text-sm"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => dispatch(softDeleteProduct(product.id))}
                    className="px-2 py-1 rounded text-sm text-white bg-[#ff0a0a]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {paginatedData.map((product) => (
          <div key={product.id} className="border p-3 rounded">
            {/* TOP ROW: Name (left) + Status (right) */}
            <div className="flex items-start justify-between md:mb-0 mb-4">
              <div>
                <div className="font-medium text-white">{product.name}</div>

                {/* Price + Category BELOW name */}
                <div className="text-sm text-gray-400">
                  ₹{product.price} • {product.category}
                </div>
              </div>

              {/* Status badge */}
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full
        ${
          product.status === "ACTIVE"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}
              >
                {product.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  dispatch(
                    addToCart({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                    })
                  );

                  toast.success(`"${product.name}" added to cart 🛒`);
                }}
                className="px-2 py-1 bg-yellow-500 text-black rounded text-sm"
              >
                Add to Cart
              </button>
              <Link
                to={`/products/${product.id}/edit`}
                className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => dispatch(toggleProductStatus(product.id))}
                className="px-3 py-1 bg-[#39f0d8] rounded text-sm"
              >
                Toggle
              </button>
              <button
                onClick={() => dispatch(softDeleteProduct(product.id))}
                className="px-3 py-1  rounded text-sm text-white bg-[#ff0a0a]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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

export default Products;
