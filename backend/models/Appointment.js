import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  date: { type: Date, required: true },
  time: String,
  notes: String
});

export default mongoose.model("Appointment", appointmentSchema);