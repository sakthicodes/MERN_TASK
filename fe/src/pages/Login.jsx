import React, { useState } from "react";
import { login } from "../api/api";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import COLORS from "../constants/colors";
import { loginleft } from '../assets';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: loginUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ email, password });
      loginUser(data.userId, data.accessToken, data.role);
      toast.success("Login successful! Redirecting to login...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
        toast.error("Invalid Cred");
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
        <img
          src={loginleft}
          alt="Login Illustration"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ width: "80%", maxWidth: 400 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: COLORS.primary, mb: 2 }}>
            Sign In
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, py: 1.5, fontSize: "1rem", textTransform: "none", backgroundColor: COLORS.primary, "&:hover": { backgroundColor: "#d90042" } }}
            >
              Login
            </Button>
          </form>
          <Typography align="center" sx={{ mt: 2, color: "gray" }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: COLORS.primary, textDecoration: "none", fontWeight: "bold" }}>
              Sign up
            </a>
          </Typography>
        </Box>
      </Grid>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
    </Grid>
  );
};

export default Login;
