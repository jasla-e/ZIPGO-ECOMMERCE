import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ANavbar from "../components/ANavbar";

function AdminLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col lg:ml-60">

        {/* NAVBAR */}
        <ANavbar setSidebarOpen={setSidebarOpen} />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5 pt-2">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;