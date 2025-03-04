import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SessionExpiredModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    onClose();
    navigate("/login");
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="session-expired-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          Session Expired
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Your session has expired. Please log in again.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Go to Login
        </Button>
      </Box>
    </Modal>
  );
};

export default SessionExpiredModal;
