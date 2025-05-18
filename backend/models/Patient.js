import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  age: { type: Number, required: [true, "Age is required"] },
  gender: { type: String, enum: ["Male", "Female"], required: [true, "Gender is required"] },
  email: { type: String },
  phone: { type: String },
  dietaryRestrictions: { type: [String], default: [] },
  physicalActivityLevel: { type: String, enum: ["Low", "Moderate", "High"] },
  medicalConditions: { type: [String], default: [] },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Patient", patientSchema);