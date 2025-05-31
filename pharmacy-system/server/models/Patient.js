const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  fhirId: { type: String, unique: true, sparse: true }, // FHIR Patient ID (optional, and sparse index allows nulls)
  // Consider adding other identifiers that might be used for matching, e.g.,
  // medicalRecordNumber: { type: String, unique: true, sparse: true },
  name: {
    given: [String],
    family: String,
  },
  gender: String,
  birthDate: Date,
  // Add other relevant patient fields as needed for the pharmacy
});

module.exports = mongoose.model('Patient', PatientSchema); 