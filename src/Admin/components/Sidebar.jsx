import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import {logoutUser} from "../../utils/auth";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("token");
    setSidebarOpen(false);

    navigate("/", { replace: true });
  };

  const linkClass = (path) =>
    `px-2 py-1 rounded transition ${
      location.pathname === path
        ? "bg-white text-black font-semibold"
        : "hover:bg-white/10"
    }`;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          bg-black text-white p-5
          h-screen w-60
          fixed top-0 left-0 z-50
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        <h1 className="text-2xl font-bold mb-10">Admin</h1>

        <div className="flex flex-col gap-3 flex-1">
          <Link
            to="/admin"
            className={linkClass("/admin")}
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className={linkClass("/admin/products")}
            onClick={() => setSidebarOpen(false)}
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className={linkClass("/admin/orders")}
            onClick={() => setSidebarOpen(false)}
          >
            Orders
          </Link>

          <Link
            to="/admin/users"
            className={linkClass("/admin/users")}
            onClick={() => setSidebarOpen(false)}
          >
            Users
          </Link>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-500 mt-auto"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;