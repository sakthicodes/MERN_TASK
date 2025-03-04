import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
const Navbar = () => {
  const { user } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-md z-5 flex justify-end gap-5 items-center">
       <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full transition duration-300"
      >
        {darkMode ? (
          <FiSun size={24} className="text-yellow-500" />
        ) : (
          <FiMoon size={24} className="text-gray-800 dark:text-white" />
        )}
      </button>
 
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
        {user?.name?.charAt(0) || "U"}
      </div>
    </header>
  );
};

export default Navbar;
