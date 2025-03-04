import React, { useState, useEffect } from "react";
import { createTask, updateTask } from "../../api/api";
import useAuthStore from "../../store/useAuthStore";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";

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

const TaskModal = ({ isOpen, onClose, onTaskCreated, task }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { accessToken } = useAuthStore();
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        // Update existing task
        const response = await updateTask(task._id, { title, description }, accessToken);
        if (response.status === 200) {
          onTaskCreated(); // Refresh task list
          onClose();
        } else {
          console.error("Failed to update task:", response);
        }
      } else {
        // Create new task
        const response = await createTask({ title, description }, accessToken);
        if (response.status === 201) {
          onTaskCreated();
          onClose();
        } else {
          console.error("Failed to create task:", response);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
          {task ? "Edit Task" : "Create Task"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            margin="normal"
          />
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
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={onClose} color="secondary" variant="contained">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {task ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default TaskModal;
