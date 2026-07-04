import React from "react";
import { Menu } from "lucide-react";

function ANavbar({ setSidebarOpen }) {

  return (
    <div className="bg-blue-100 shadow-sm px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-30">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden"
        >
          <Menu size={28} />
        </button>

        {/* TITLE */}
        <h1 className="text-xl md:text-2xl font-bold">
          Admin Panel
        </h1>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* ADMIN PROFILE */}
        <div className="hidden sm:flex flex-col text-right">

          <span className="font-semibold">
            ADMIN
          </span>

          <span className="text-sm text-gray-500">
            admin@gmail.com
          </span>

        </div>

        {/* PROFILE IMAGE */}
        <img
          src="/images/logo.png"
          alt="admin"
          className="w-10 h-10  "
        />

      </div>

    </div>
  );
}

export default ANavbar;