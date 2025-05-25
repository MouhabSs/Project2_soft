import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import nutritionPlanRoutes from "./routes/nutritionPlanRoutes.js";
import nutritionPlanHistoryRoutes from "./routes/nutritionPlanHistoryRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors()); // <-- Move this up!
app.use(express.json()); // <-- And this!

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/nutrition-plans", nutritionPlanRoutes);
app.use("/api/nutrition-plan-history", nutritionPlanHistoryRoutes);
app.use("/api/messages", messageRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

import { Server } from "socket.io";
import http from "http";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));