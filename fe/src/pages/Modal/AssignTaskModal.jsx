import React, { useState } from "react";
import { assignTask } from "../../api/api";
import useAuthStore from "../../store/useAuthStore";
import { Modal, Box, Button, TextField, Typography, MenuItem, Select } from "@mui/material";
import { FiCheck } from "react-icons/fi";
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

const AssignTaskModal = ({ isOpen, onClose, onTaskCreated, task, users }) => {
  const { accessToken } = useAuthStore();
  const isAssignMode = Boolean(task);
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState(task ? task.assignedTo : "");
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAssignMode) { 
      if (!selectedUser) return;
      const response = await assignTask(task._id, selectedUser, accessToken);
      onTaskCreated(response.data);
      onClose();
    
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" gutterBottom>
          {title}
        </Typography>

        <form onSubmit={handleSubmit}>
          
          {!isAssignMode && (
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              margin="normal"
              multiline
              rows={3}
            />
          )}

           {isAssignMode && (
            <Select
              fullWidth
              displayEmpty
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              renderValue={(selected) =>
                selected
                  ? users.find((user) => user._id === selected)?.name
                  : "Select a User"
              }
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name} {selectedUser === user._id && <FiCheck />}
                </MenuItem>
              ))}
            </Select>
          )}

          {/* Buttons */}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={onClose} color="secondary" variant="contained">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {isAssignMode ? "Assign" : "Create"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AssignTaskModal;
