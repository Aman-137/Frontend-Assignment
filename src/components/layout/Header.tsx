import { Menu } from "lucide-react";

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="h-14 bg-[#000000] rounded-[20px] mx-[5px] flex items-center justify-between px-4 sm:px-6">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile only) */}
        <button onClick={onMenuClick} className="md:hidden text-white mr-1">
          <Menu size={22} />
        </button>

        {/* Avatar */}
        <div className="p-[2px] rounded-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm">
            A
          </div>
        </div>

        {/* Name (hide on very small screens) */}
        <h1 className="text-lg text-white font-medium hidden sm:block">
          Aman Kumar
        </h1>
      </div>

      {/* RIGHT SECTION */}
      <button className="px-4 py-1.5 text-sm rounded-full border border-white text-white hover:bg-white hover:text-black transition">
        Login / Signup
      </button>
    </header>
  );
};

export default Header;
