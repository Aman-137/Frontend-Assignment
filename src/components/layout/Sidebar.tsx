import { NavLink } from "react-router-dom";

const Sidebar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  return (
    <>
      {/* OVERLAY (mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          w-64 bg-[#000000] text-white min-h-screen
          p-4 rounded-[20px] mx-[5px]
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h2 className="text-xl font-extrabold mb-6">Admin Panel</h2>

        <nav className="space-y-2">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-white text-black font-bold"
                  : "hover:bg-gray-100 hover:text-black"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-white text-black font-bold"
                  : "hover:bg-gray-100 hover:text-black"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/orders"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-white text-black font-bold"
                  : "hover:bg-gray-100 hover:text-black"
              }`
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/cart"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-white text-black font-bold"
                  : "hover:bg-gray-100 hover:text-black"
              }`
            }
          >
            Cart
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
