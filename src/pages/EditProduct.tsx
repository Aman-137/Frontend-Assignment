import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateProduct } from "../features/products/productsSlice";
import { useState } from "react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const product = useAppSelector((state) =>
    state.products.items.find((p) => p.id === id)
  );

  const [form, setForm] = useState(() => ({
    name: product?.name || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    category: product?.category || "",
    rating: product?.rating || 1,
  }));

  if (!product) {
    return <p className="text-white">Product not found</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      updateProduct({
        ...product, // keep existing fields
        name: form.name,
        price: +form.price,
        stock: +form.stock,
        category: form.category,
        rating: +form.rating,
        updatedAt: new Date().toISOString(),
      })
    );

    navigate("/products");
  };

  return (
    <div className="max-w-xl text-white border p-8 rounded-xl">
      <h1 className="text-2xl font-semibold mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white text-black"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white text-black"
        />

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white text-black"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white text-black"
        />

        <input
          name="rating"
          type="number"
          min="1"
          max="5"
          value={form.rating}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white text-black"
        />

        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-blue-600 rounded">
            Update
          </button>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-4 py-2 bg-gray-600 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
