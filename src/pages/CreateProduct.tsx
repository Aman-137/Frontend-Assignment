import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { addProduct } from "../features/products/productsSlice";

const CreateProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    rating: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 VALIDATION (assignment rules)
    if (form.name.length < 3) {
      return setError("Name must be at least 3 characters");
    }
    if (+form.price <= 0) {
      return setError("Price must be greater than 0");
    }
    if (+form.stock < 0) {
      return setError("Stock cannot be negative");
    }
    if (!form.category) {
      return setError("Category is required");
    }
    if (+form.rating < 1 || +form.rating > 5) {
      return setError("Rating must be between 1 and 5");
    }

    dispatch(
      addProduct({
        id: Date.now().toString(),
        name: form.name,
        price: +form.price,
        stock: +form.stock,
        category: form.category,
        rating: +form.rating,
        status: "ACTIVE",
        updatedAt: new Date().toISOString(),
        isDeleted: false,
      })
    );

    navigate("/products");
  };

  return (
    <div className="max-w-xl text-white border p-8 rounded-xl">
      <h1 className="text-3xl font-semibold mb-8">Create Product</h1>

      {error && <p className="text-red-400 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-[#fffff] border text-black"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-[#fffff] border text-black"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-[#fffff] border text-black"
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-[#fffff] border text-black"
        />

        <input
          name="rating"
          type="number"
          placeholder="Rating (1–5)"
          value={form.rating}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-[#fffff] border text-black"
        />

        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-green-600 rounded">
            Create
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

export default CreateProduct;
