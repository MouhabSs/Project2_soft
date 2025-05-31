const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  fhirId: { type: String, unique: true }, // To store the FHIR resource ID
  code: {
    coding: [{
      system: String,
      code: String,
      display: String
    }]
  },
  name: String, // Add a name field for easier display
  // Add other relevant Medication fields as needed
});

module.exports = mongoose.model('Medication', MedicationSchema); 