import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Layout from "../layout/Layout";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TaskMng from "../pages/TaskMng";
import UserManagement from "../pages/UserMng";
import Logout from "../pages/Logout";
const isAuthenticated = () => !!localStorage.getItem("accessToken");
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} /> 
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/task-mng" element={<PrivateRoute element={<TaskMng />} />} />
        <Route path="/user-mng" element={<PrivateRoute element={<UserManagement />} />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;
