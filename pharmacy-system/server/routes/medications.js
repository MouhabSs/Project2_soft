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

// Route to add a new medication
router.post('/medications', async (req, res) => {
  try {
    const newMedication = new Medication(req.body);
    await newMedication.save();
    res.status(201).json({ message: 'Medication added successfully', medication: newMedication });
  } catch (error) {
    console.error('Error adding medication:', error);
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