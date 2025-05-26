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

// DELETE /api/appointments/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
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