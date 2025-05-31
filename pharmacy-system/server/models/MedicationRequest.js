const mongoose = require('mongoose');

const MedicationRequestSchema = new mongoose.Schema({
  fhirId: { type: String, unique: true, sparse: true }, // To store the FHIR resource ID
  status: String,
  intent: String,
  medicationReference: {
    reference: String, // Reference to the FHIR Medication resource (e.g., Medication/fhirId)
    display: String
  },
  medicationRef: { // Reference to our internal Medication document
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
  },
  subject: {
    reference: String, // Reference to the FHIR Patient resource
    display: String
  },
  patientRef: { // Reference to our internal Patient document
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  requester: {
    reference: String, // Reference to the FHIR Practitioner resource
    display: String
  },
  dosageInstruction: [{
    text: String,
    // Add other relevant dosage instruction fields
  }],
  // Add other relevant MedicationRequest fields as needed
});

module.exports = mongoose.model('MedicationRequest', MedicationRequestSchema); 