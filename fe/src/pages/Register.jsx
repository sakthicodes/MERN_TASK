import React, { useState } from "react";
import { register } from "../api/api";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import COLORS from "../constants/colors";
import { registerleft } from "../assets"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ name: name, email, password });
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Email is already registered. Please use a different email.");
      } else {
        toast.error("Registration Failed. Please try again.");
      }
    }
  };
  return ( 
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}
      >
        <img src={registerleft} alt="Register" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ width: "80%", maxWidth: 400 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: COLORS.primary, mb: 2 }}>
            Create an Account
          </Typography>

          <form onSubmit={handleRegister}>
             <TextField
              label="Full Name"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              Sign Up
            </Button>
          </form>

     
          <Typography align="center" sx={{ mt: 2, color: "gray" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: COLORS.primary, textDecoration: "none", fontWeight: "bold" }}>
              Sign in
            </a>
          </Typography>
        </Box>
      </Grid>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Grid>
  );
};

export default Register;
