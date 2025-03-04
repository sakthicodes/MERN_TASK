import Task from "../models/Task.js";
import User from "../models/User.js";

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({
      title,
      description,
      status: "Pending",
      createdBy: req.user.userId,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getAllTasks = async (req, res) => {
  try {
    const { parentId } = req.query;
    if (!parentId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const user = await User.findById(parentId);
     if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let tasks;
    if (user.role === "user") {
      tasks = await Task.find({ assignedTo: user._id });
     } else {
      tasks = await Task.find({ createdBy: parentId });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};


export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { assignedTo: userId }, { new: true });

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
