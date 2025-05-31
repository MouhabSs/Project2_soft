import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// POST /api/appointments
router.post("/", async (req, res, next) => {
  try {
    const { patientId, date, time, notes } = req.body;
    if (!patientId || !date) return res.status(400).json({ error: "patientId and date are required" });
    const appointment = new Appointment({ patientId, date, time, notes });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
});

// GET /api/appointments
router.get("/", async (req, res, next) => {
  try {
    const appointments = await Appointment.find().populate("patientId", "name");
    res.json(appointments);
  } catch (err) {
    next(err);
  }
});

// GET /api/appointments/:id
router.get("/:id", async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("patientId", "name");
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
});

// PUT /api/appointments/:id
router.put("/:id", async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/appointments/:id - Mark as cancelled instead of deleting
router.delete("/:id", async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled", cancelledAt: new Date() },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment cancelled", appointment });
  } catch (err) {
    next(err);
  }
});

// GET /api/appointments/cancelled - Get cancelled appointments
router.get("/cancelled", async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ status: "cancelled" })
      .populate("patientId", "name");
    res.json(appointments);
  } catch (err) {
    next(err);
  }
});

// GET /api/appointments/today - Get this week's appointments
router.get("/today", async (req, res, next) => {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay()); // Sunday
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setDate(now.getDate() + (6 - now.getDay())); // Saturday
    end.setHours(23, 59, 59, 999);
    const appointments = await Appointment.find({
      date: { $gte: start, $lte: end },
      status: { $ne: "cancelled" }
    }).populate("patientId", "name");
    // Format for frontend
    const formatted = appointments.map(appt => ({
      patientName: appt.patientId?.name || "Unknown",
      reason: appt.notes || "General",
      time: appt.date
    }));
    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

export default router;

/*
Example JSON for POST/PUT:
{
  "patientId": "609c1f2b8f1b2c0015b2c123",
  "date": "2025-05-12T10:00:00Z",
  "time": "10:00 AM",
  "notes": "Follow-up"
}
*/