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
    const filter = {};
    const { age, gender, medicalConditions } = req.query;

    if (age) {
      // Assuming age can be a single value for exact match or a range (e.g., '30-40')
      // For simplicity, let's support exact age or a minimum age (e.g., '>=30') or a maximum age '<40'
      if (age.startsWith('>=')) {
        filter.age = { $gte: parseInt(age.substring(2)) };
      } else if (age.startsWith('<=')) {
         filter.age = { $lte: parseInt(age.substring(2)) };
      } else if (age.startsWith('>')) {
         filter.age = { $gt: parseInt(age.substring(1)) };
      } else if (age.startsWith('<')) {
         filter.age = { $lt: parseInt(age.substring(1)) };
      } else if (age.includes('-')) {
        const [minAge, maxAge] = age.split('-').map(Number);
        filter.age = { $gte: minAge, $lte: maxAge };
      } else {
        filter.age = parseInt(age);
      }
      // Ensure age is a valid number after parsing/splitting
       if (isNaN(filter.age) && (!filter.age || !filter.age.$gte)) {
           delete filter.age; // Remove invalid age filter
       }
    }

    if (gender) {
      filter.gender = gender; // Assuming exact match for gender
    }

    if (medicalConditions) {
      // Assuming medicalConditions is a comma-separated string of conditions
      const conditionsArray = medicalConditions.split(',').map(condition => new RegExp(condition.trim(), 'i'));
      filter.medicalConditions = { $in: conditionsArray }; // Match if patient has any of the listed conditions
    }

    // Add name search back in, combining with filters if they exist
    const { search } = req.query;
    if (search) {
       filter.name = { $regex: search, $options: 'i' }; // Case-insensitive search by name
    }

    const patients = await Patient.find(filter);
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

// DELETE /api/patients/:id - Mark patient as 'Unknown Patient' and keep record
router.delete("/:id", async (req, res, next) => {
  try {
    // Update all appointments for this patient to show 'Unknown Patient'
    await Appointment.updateMany(
      { patientId: req.params.id },
      { $set: { patientName: "Unknown Patient" } }
    );
    
    // Mark patient as inactive instead of deleting
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          name: "Unknown Patient",
          active: false,
          email: "",
          phone: ""
        }
      },
      { new: true }
    );
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    
    res.json({
      success: true,
      message: "Patient marked as inactive and appointments updated"
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