import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut, FiUsers, FiClipboard, FiHome } from "react-icons/fi";
import useAuthStore from "../store/useAuthStore";

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout, role } = useAuthStore(); 

  return (
    <aside className={`bg-gray-900 text-white h-screen p-5 fixed top-0 left-0 z-10 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
      <div className="flex items-center justify-between mb-8">
        {sidebarOpen && <h2 className="text-xl font-semibold">Task Manager</h2>}
        <button onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
      </div>
      <nav>
        <ul className="space-y-8">
          <li onClick={() => navigate("/dashboard")} className="flex items-center gap-3 cursor-pointer hover:text-gray-300">
            <FiHome size={20} />
            {sidebarOpen && "Dashboard"}
          </li>
          
          {role === "admin" && (
            <li onClick={() => navigate("/task-mng")} className="flex items-center gap-3 cursor-pointer hover:text-gray-300">
              <FiClipboard size={20} />
              {sidebarOpen && "Task Management"}
            </li>
          )}
 
          {role === "admin" && (
            <li onClick={() => navigate("/user-mng")} className="flex items-center gap-3 cursor-pointer hover:text-gray-300">
              <FiUsers size={20} />
              {sidebarOpen && "User Management"}
            </li>
          )}

          <li onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-3 cursor-pointer hover:text-gray-300">
            <FiLogOut size={20} />
            {sidebarOpen && "Logout"}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
