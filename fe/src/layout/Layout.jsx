import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useThemeStore from "../store/useThemeStore";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode } = useThemeStore(); 
  return (
    <div className={`flex h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100"}`}>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <Navbar /> 
        <main className="flex-1 overflow-y-auto mt-16 p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
