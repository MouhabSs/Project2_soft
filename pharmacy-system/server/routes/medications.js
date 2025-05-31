const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');

// Route to get all medications
router.get('/medications', async (req, res) => {
  try {
    const medications = await Medication.find();
    res.status(200).json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST route to add a new medication
router.post('/', async (req, res) => {
  try {
    const { name, code, system, fhirId } = req.body;

    // Basic validation
    if (!name || !code || !system) {
      return res.status(400).json({ message: 'Medication name, code, and system are required.' });
    }

    // Check if medication with this code and system already exists
    const existingMedication = await Medication.findOne({
      'code.coding': { $elemMatch: { code: code, system: system } }
    });

    if (existingMedication) {
      return res.status(409).json({ message: `Medication with code ${code} and system ${system} already exists.` });
    }

    const newMedication = new Medication({
      fhirId: fhirId, // Optional: if a FHIR ID is provided
      name: name,
      code: {
        coding: [
          {
            system: system,
            code: code,
            display: name // Use the name as display for simplicity
          }
        ]
      }
    });

    await newMedication.save();

    res.status(201).json({ message: 'Medication added successfully', medication: newMedication });
  } catch (error) {
    console.error('Error adding medication', { name, code, system, fhirId }, ':', error);
    console.error('Full error object:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/medications/:id
router.delete('/medications/:id', async (req, res) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    // Note: Deleting a medication does not automatically delete linked inventory items or medication requests.
    // In a real system, you might want to implement cascading deletes or checks.
    res.json({ message: 'Medication deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 