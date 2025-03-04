import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask,
  getAssignedTasks,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getAllTasks);
router.get("/:id", authMiddleware, getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.put("/:id/status", authMiddleware, updateTaskStatus);
router.put("/:id/assign", authMiddleware, assignTask);
router.get("/assigned/:userId", authMiddleware, getAssignedTasks);

export default router;
