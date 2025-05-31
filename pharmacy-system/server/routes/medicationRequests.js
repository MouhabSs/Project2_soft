const express = require('express');
const router = express.Router();
const MedicationRequest = require('../models/MedicationRequest');
const Medication = require('../models/Medication');
const Patient = require('../models/Patient');
const InventoryItem = require('../models/InventoryItem');

// Route to receive FHIR MedicationRequest
router.post('/fhir/MedicationRequest', async (req, res) => {
  try {
    const fhirMedicationRequest = req.body;

    // Basic FHIR resource type validation
    if (fhirMedicationRequest.resourceType !== 'MedicationRequest') {
      return res.status(400).json({ message: 'Invalid FHIR resource type' });
    }

    // Check if a MedicationRequest with this FHIR ID already exists to prevent duplicates
    if (fhirMedicationRequest.id) {
        const existingRequest = await MedicationRequest.findOne({ fhirId: fhirMedicationRequest.id });
        if (existingRequest) {
            return res.status(409).json({ message: `MedicationRequest with FHIR ID ${fhirMedicationRequest.id} already exists.` });
        }
    }

    // Extract relevant data and attempt to link to internal records
    const newMedicationRequest = new MedicationRequest({
      fhirId: fhirMedicationRequest.id, // Store the FHIR resource ID
      status: fhirMedicationRequest.status,
      intent: fhirMedicationRequest.intent,
      medicationReference: fhirMedicationRequest.medicationReference,
      subject: fhirMedicationRequest.subject,
      requester: fhirMedicationRequest.requester,
      dosageInstruction: fhirMedicationRequest.dosageInstruction,
      // Extract medication display from codeableConcept if available
      medicationDisplayString: fhirMedicationRequest.medicationCodeableConcept?.display || fhirMedicationRequest.medicationCodeableConcept?.coding?.[0]?.display,
    });

    // Attempt to find and link the internal Patient record
    if (fhirMedicationRequest.subject?.reference) {
        const patientFhirId = fhirMedicationRequest.subject.reference.split('/')[1]; // Extract FHIR ID from reference string
        const patient = await Patient.findOne({ fhirId: patientFhirId });
        if (patient) {
            newMedicationRequest.patientRef = patient._id; // Link to internal Patient document
            console.log(`Linked MedicationRequest to internal Patient with ID: ${patient._id}`);
        } else {
            console.warn(`No internal Patient found with FHIR ID: ${patientFhirId}. MedicationRequest will not be linked to a patient.`);
            // In a real system, you might want to create a new minimal patient record here or queue for manual linking
        }
    }

    // Attempt to find and link the internal Medication record using codeableConcept
    const medicationCoding = fhirMedicationRequest.medicationCodeableConcept?.coding?.[0];
    if (medicationCoding?.system && medicationCoding?.code) {
        const medication = await Medication.findOne({
            'code.coding': { $elemMatch: { system: medicationCoding.system, code: medicationCoding.code } }
        });
        if (medication) {
            newMedicationRequest.medicationRef = medication._id; // Link to internal Medication document
            console.log(`Linked MedicationRequest to internal Medication with ID: ${medication._id} using codeableConcept`);
        } else {
            console.warn(`No internal Medication found with system: ${medicationCoding.system} and code: ${medicationCoding.code}. MedicationRequest will not be linked to a medication.`);
            // In a real system, you might want to create a new minimal medication record here or queue for manual linking
        }
    } else if (fhirMedicationRequest.medicationReference?.reference) {
        // Fallback to linking by medicationReference if codeableConcept is not available
        const medicationFhirId = fhirMedicationRequest.medicationReference.reference.split('/')[1]; // Extract FHIR ID from reference string
         const medication = await Medication.findOne({ fhirId: medicationFhirId });
        if (medication) {
            newMedicationRequest.medicationRef = medication._id; // Link to internal Medication document
            console.log(`Linked MedicationRequest to internal Medication with ID: ${medication._id} using medicationReference`);
        } else {
            console.warn(`No internal Medication found with FHIR ID: ${medicationFhirId}. MedicationRequest will not be linked to a medication.`);
        }
    }

    await newMedicationRequest.save();

    res.status(201).json({ message: 'MedicationRequest received and processed', fhirId: newMedicationRequest.fhirId, _id: newMedicationRequest._id });
  } catch (error) {
    console.error('Error processing MedicationRequest:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all MedicationRequests (update to populate linked refs)
router.get('/medication-requests', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.authoredOn = {}; // Assuming a field like 'authoredOn' exists or can be added to the schema
      if (startDate) {
        filter.authoredOn.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.authoredOn.$lte = new Date(endDate);
      }
    }

    // Add filter to find query
    const medicationRequests = await MedicationRequest.find(filter)
        .populate('patientRef') // Populate linked patient details
        .populate('medicationRef'); // Populate linked medication details
    
    res.status(200).json(medicationRequests);
  } catch (error) {
    console.error('Error fetching medication requests:', error);
    console.error('Full error fetching medication requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/medication-requests/dispense/:id
router.post('/medication-requests/dispense/:id', async (req, res) => {
  try {
    console.log(`Attempting to dispense medication request with ID: ${req.params.id}`);
    // Populate both medicationRef and patientRef for full context if needed later, though medicationRef is key for inventory
    const medicationRequest = await MedicationRequest.findById(req.params.id).populate('medicationRef');

    if (!medicationRequest) {
      console.warn(`Medication Request with ID: ${req.params.id} not found.`);
      return res.status(404).json({ message: 'Medication Request not found' });
    }

    console.log(`Found Medication Request. Linked Medication ID: ${medicationRequest.medicationRef?._id}`);
    if (!medicationRequest.medicationRef) {
      console.warn(`Medication Request with ID: ${req.params.id} is not linked to an internal medication. Cannot dispense.`);
      return res.status(400).json({ message: 'Medication Request not linked to a medication.' });
    }

    console.log(`Looking for inventory item for Medication ID: ${medicationRequest.medicationRef._id}`);
    const inventoryItem = await InventoryItem.findOne({ medication: medicationRequest.medicationRef._id });

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      console.warn(`Insufficient quantity for Medication ID: ${medicationRequest.medicationRef?._id}. Current quantity: ${inventoryItem?.quantity}`);
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    console.log(`Inventory found. Decrementing quantity from ${inventoryItem.quantity}`);
    inventoryItem.quantity -= 1;
    await inventoryItem.save();
    console.log(`Quantity decremented and inventory saved. New quantity: ${inventoryItem.quantity}`);

    medicationRequest.status = 'dispensed'; // Or a similar status like 'completed'
    await medicationRequest.save();
    console.log('Medication Request status updated to dispensed and saved.');

    res.json({ message: 'Medication dispensed successfully', medicationRequest });
  } catch (err) {
    console.error('Error dispensing medication:', err);
    console.error('Full error dispensing medication:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/medication-requests/:id
router.delete('/medication-requests/:id', async (req, res) => {
  try {
    const medicationRequest = await MedicationRequest.findByIdAndDelete(req.params.id);
    if (!medicationRequest) {
      return res.status(404).json({ message: 'Medication Request not found' });
    }
    res.json({ message: 'Medication Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 