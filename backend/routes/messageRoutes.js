import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// GET /api/messages
router.get("/", async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
});

// You can add other routes here later, like POST for creating messages

export default router; 