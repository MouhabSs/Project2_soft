const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Route to get all patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to add a new patient
router.post('/patients', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/patients/:id
router.delete('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
     // Note: Deleting a patient does not automatically delete linked medication requests.
    // In a real system, you might want to implement cascading deletes or checks.
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add routes for updating or deleting patients as needed

module.exports = router; 