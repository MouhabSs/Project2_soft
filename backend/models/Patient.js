import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  email: String,
  phone: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Patient", patientSchema);