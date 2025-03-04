import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
 
app.use(express.json());
 
const corsOptions = {
  origin: "https://mern-task-vercel.vercel.app/",
  methods: "GET,POST,PUT,DELETE",
  credentials: true, 
};

app.use(cors(corsOptions));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
 
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("MongoDB connection error:", err));
