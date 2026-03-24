"use client"
import { useState } from "react";
import { signOut } from "next-auth/react";

const AdminNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <nav className="bg-white shadow-md px-6 py-4 rounded-md">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

          {/* Hamburger Button â€” mobile only */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="/admin/get-users" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Manage Users
            </a>
            <a href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Post Resorts
            </a>
            <a href="/admin/manage-resorts" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Manage Resorts
            </a>
            <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="lg:hidden mt-4 flex flex-col gap-3 border-t pt-4">
            <a href="/admin/get-users" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Manage Users
            </a>
            <a href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Post Resorts
            </a>
            <a href="/admin/manage-resorts" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Manage Resorts
            </a>
            <button onClick={() => signOut()} className="w-fit px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default AdminNav;
