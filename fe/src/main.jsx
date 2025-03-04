import React from "react"; // ✅ Import React
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
const theme = localStorage.getItem("theme");
if (theme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
ReactDOM.createRoot(document.getElementById("root")).render(
     <App />
 );
