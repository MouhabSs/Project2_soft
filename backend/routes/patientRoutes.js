import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

// POST /api/patients - Add a new patient
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      age,
      gender,
      email,
      phone,
      dietaryRestrictions,
      physicalActivityLevel,
      medicalConditions,
      notes
    } = req.body;

    // Validate required fields
    if (!name || !age || !gender) {
      return res.status(400).json({
        success: false,
        message: "Name, age, and gender are required"
      });
    }

    const patient = new Patient({
      name,
      age,
      gender,
      email,
      phone,
      dietaryRestrictions,
      physicalActivityLevel,
      medicalConditions,
      notes
    });

    await patient.save();
    res.status(201).json({
      success: true,
      message: "Patient added successfully",
      data: patient
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next(err);
  }
});

// GET /api/patients - Get all patients
router.get("/", async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.json({
      success: true,
      data: patients
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/patients/:id - Get single patient by ID
router.get("/:id", async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    res.json({
      success: true,
      data: patient
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/patients/:id - Update patient
router.put("/:id", async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    res.json({
      success: true,
      message: "Patient updated successfully",
      data: patient
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next(err);
  }
});

// DELETE /api/patients/:id - Delete patient
router.delete("/:id", async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    res.json({
      success: true,
      message: "Patient deleted successfully"
    });
  } catch (err) {
    next(err);
  }
});

export default router;

/*
Example JSON for POST/PUT:
{
  "name": "Alice Smith",
  "age": 30,
  "gender": "Female",
  "email": "alice@example.com",
  "phone": "1234567890",
  "notes": "No allergies"
}
*/