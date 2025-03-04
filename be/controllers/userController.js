import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
 
export const getUsers = async (req, res) => {
  try {
    const { parentId } = req.query;
     if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ error: "Invalid parentId format" });
    }
    const users = await User.find({ parentId }).select("_id name email role parentId");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

 
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, parentId } = req.body;

    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ error: "Invalid parentId format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, parentId });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};
 
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};
