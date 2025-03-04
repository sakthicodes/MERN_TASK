import React, { useState, useEffect } from "react";
import { createUser, updateUser } from "../../api/api";
import useAuthStore from "../../store/useAuthStore";
import { Modal, Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const UserModal = ({ isOpen, onClose, onUserCreated, user }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const { userId, accessToken } = useAuthStore();
   useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "user");
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {  
        const response = await updateUser(user._id, { name, email, role }, accessToken);
        if (response.status === 200) {
          toast.success("User updated successfully!");
          onUserCreated();
          onClose();
        } else {
          toast.error(" Failed to update user.");
        }
      } else {  
        const response = await createUser({ name, email, password, role, parentId: userId }, accessToken);
        if (response.status === 201) {
          toast.success("✅ User created successfully!");
          onUserCreated();
          onClose();
        } else if (response.status === 400 && response.data.error === "Email already in use") {
          toast.error(" Email already in use! Try another.");
        } else {
          toast.error(" Failed to create user.");
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(" An error occurred!");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
          {user ? "Edit User" : "Create User"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} required margin="normal" />
          <TextField fullWidth label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} required margin="normal" type="email" />
          {!user && <TextField fullWidth label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} required margin="normal" type="password" />}
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={onClose} color="secondary" variant="contained">Cancel</Button>
            <Button type="submit" color="primary" variant="contained">{user ? "Update" : "Create"}</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default UserModal;
