const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/nutrition_clinic", { useNewUrlParser: true, useUnifiedTopology: true });

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  notes: String
});
const Patient = mongoose.model("Patient", patientSchema);

// Mock authentication middleware
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    res.json({ token: "mock-token" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Patient endpoints
app.get("/api/patients", async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

app.post("/api/patients", async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.json(patient);
});

app.get("/api/patients/:id", async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  res.json(patient);
});

app.listen(5000, () => console.log("Server running on port 5000"));