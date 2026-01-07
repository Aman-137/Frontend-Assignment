import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import { Toaster } from "react-hot-toast";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            color: "#fff",
            background:
              "linear-gradient(#111, #111) padding-box, linear-gradient(90deg, #facc15, #22c55e, #3b82f6) border-box",
            border: "2px solid transparent",
            borderRadius: "10px",
          },
        }}
      />
      {/* Full screen white canvas */}
      <div className="min-h-screen bg-white">
        <div className="flex h-screen">
          {/* SIDEBAR */}
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          {/* RIGHT SECTION */}
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <Header onMenuClick={() => setSidebarOpen((p) => !p)} />

            {/* MAIN CONTENT */}
            <main className="flex-1 bg-[#000000] rounded-[20px] p-6 mx-[5px] overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/products/new" element={<CreateProduct />} />
                <Route path="/products/:id/edit" element={<EditProduct />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
