import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SendMedicationRequestPage() {
  const [patientId, setPatientId] = useState('');
  const [patients, setPatients] = useState([]); // State to hold patients for the dropdown
  const [medicationDisplay, setMedicationDisplay] = useState('');
  const [medicationCode, setMedicationCode] = useState('');
  const [medicationSystem, setMedicationSystem] = useState('');
  const [dosageText, setDosageText] = useState('');
  const [requesterDisplay, setRequesterDisplay] = useState('Doco');
  const [statusMessage, setStatusMessage] = useState('');

  // Mapping for medication display names to codes
  const medicationCodeMapping = {
    'Vitamin D3 2000 IU': 'VITD',
    'Omega-3 Fish Oil 1000mg': 'OMEGA3',
    'Probiotic 50 Billion CFU': 'PROBIO',
    'Magnesium Citrate Powder': 'MAGCIT',
    'Turmeric Curcumin Capsules': 'TURMER',
    'Multivitamin': 'MULTI',
    // Add more mappings as needed
  };

  useEffect(() => {
    // Fetch patients from the Clinic backend when the component mounts
    const fetchPatients = async () => {
      try {
        // Fetch patients from the Clinic backend using the proxy
        const response = await axios.get('/api/patients');
        setPatients(response.data.data); // Assuming the response structure is { data: [...] }
      } catch (error) {
        console.error('Error fetching patients:', error);
        setStatusMessage('Failed to load patients.');
      }
    };

    fetchPatients();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to automatically set medication code when medication display name changes
  useEffect(() => {
    const code = medicationCodeMapping[medicationDisplay];
    setMedicationCode(code || ''); // Set code if found, otherwise clear
    // If a code is found and no system is manually selected, default the system
    if (code && !medicationSystem) {
      setMedicationSystem('http://www.nlm.nih.gov/research/umls/rxnorm'); // Default to RXNorm
    }
  }, [medicationDisplay]); // Re-run this effect when medicationDisplay changes

  // Helper to display patient name
  const displayPatientName = (patient) => {
    // Prioritize FHIR-like name structure from the Clinic backend
    if (patient && patient.name && patient.name.given && patient.name.family) {
      return `${patient.name.given.join(' ')} ${patient.name.family}`;
    } else if (patient && patient.name && typeof patient.name === 'string') {
      // Fallback for a simple string name if present
      return patient.name;
    } else if (patient && patient._id) { // Fallback to patient ID
      return `Patient ID: ${patient._id}`;
    }
    return 'Unknown Patient'; // Final fallback
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(''); // Clear previous messages

    // Basic validation
    if (!patientId || !medicationDisplay || !dosageText || !requesterDisplay) {
      setStatusMessage('Please fill in all required fields.');
      return;
    }

    // Construct a basic FHIR MedicationRequest resource
    const fhirMedicationRequest = {
      resourceType: 'MedicationRequest',
      id: `medrx-${Date.now()}`, // Generate a unique ID (simple timestamp for now)
      status: 'active', // Or 'draft', 'on-hold', etc.
      intent: 'order', // Or 'proposal', 'plan', 'order', 'option'
      medicationCodeableConcept: { // Using CodeableConcept as a simple representation
        coding: [
          {
            system: medicationSystem || 'http://terminology.hl7.org/CodeSystem/v3-RXNORM', // Example system
            code: medicationCode || 'unknown', // Example code
            display: medicationDisplay,
          }
        ],
        text: medicationDisplay, // Redundant but often included
      },
      subject: {
        reference: `Patient/${patientId}`, // Reference to the patient in the Patient resource space (using selected ID)
        display: displayPatientName(patients.find(p => p._id === patientId) || {}), // Display selected patient's name
      },
      requester: {
        display: requesterDisplay,
      },
      dosageInstruction: [
        {
          text: dosageText,
          // Add structured dosage fields (timing, route, doseAndRate) if needed
        }
      ],
      // Add other relevant fields like encounter, authoredOn, etc.
    };

    console.log('Sending FHIR MedicationRequest:', fhirMedicationRequest);
    console.log('FHIR Request Payload:', fhirMedicationRequest);

    try {
      // Send the FHIR MedicationRequest to the Pharmacy System's endpoint
      // Note: The proxy in frontend/package.json should route /api requests to the Clinic backend (port 5000)
      // The Pharmacy System is on port 5001, so we need to use the full URL.
      const response = await axios.post('http://localhost:5001/api/fhir/MedicationRequest', fhirMedicationRequest);

      console.log('Response from Pharmacy System:', response.data);
      setStatusMessage('Medication Request sent successfully!');

      // Clear form (optional)
      setPatientId('');
      setMedicationDisplay('');
      setMedicationCode('');
      setMedicationSystem('');
      setDosageText('');
      setRequesterDisplay('Doco'); // Keep requester as Doco

    } catch (error) {
      console.error('Error sending Medication Request:', error);
      setStatusMessage(`Failed to send Medication Request: ${error.message}`);
    }
  };

  return (
    <div className="send-medication-request-page">
      <h2>Send New Medication Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patientId">Patient:</label>
          <select id="patientId" value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
            <option value="">Select a Patient</option>
            {patients.map(patient => (
              <option key={patient._id} value={patient._id}>
                {displayPatientName(patient)}
              </option>
            ))}
          </select>
        </div>
         <div>
          <label htmlFor="medicationDisplay">Medication Display Name:</label>
          <select
            id="medicationDisplay"
            value={medicationDisplay}
            onChange={(e) => setMedicationDisplay(e.target.value)}
            required
          >
            <option value="">Select a Supplement</option>
            <option value="Vitamin D3 2000 IU">Vitamin D3 2000 IU</option>
            <option value="Omega-3 Fish Oil 1000mg">Omega-3 Fish Oil 1000mg</option>
            <option value="Probiotic 50 Billion CFU">Probiotic 50 Billion CFU</option>
            <option value="Magnesium Citrate Powder">Magnesium Citrate Powder</option>
            <option value="Turmeric Curcumin Capsules">Turmeric Curcumin Capsules</option>
            <option value="Multivitamin">Multivitamin</option>
            {/* Add more supplement options as needed */}
          </select>
        </div>
        <div>
          <label htmlFor="medicationCode">Medication Code (Optional):</label>
          <select
            id="medicationCode"
            value={medicationCode}
            readOnly // Make the dropdown read-only
            onChange={(e) => setMedicationCode(e.target.value)}
          >
            <option value="">Select a Code</option>
            <option value="VITD">VITD (Vitamin D3 2000 IU)</option>
            <option value="OMEGA3">OMEGA3 (Omega-3 Fish Oil 1000mg)</option>
            <option value="PROBIO">PROBIO (Probiotic 50 Billion CFU)</option>
            <option value="MAGCIT">MAGCIT (Magnesium Citrate Powder)</option>
            <option value="TURMER">TURMER (Turmeric Curcumin Capsules)</option>
            <option value="MULTI">MULTI (Multivitamin)</option>
            {/* Add more supplement codes as needed */}
          </select>
        </div>
        <div>
          <label htmlFor="medicationSystem">Medication System (Optional):</label>
          <select
            id="medicationSystem"
            value={medicationSystem}
            onChange={(e) => setMedicationSystem(e.target.value)}
          >
            <option value="">Select a System</option>
            <option value="http://snomed.info/sct">SNOMED CT</option>
            <option value="http://www.nlm.nih.gov/research/umls/rxnorm">RxNorm</option>
            <option value="http://loinc.org">LOINC</option>
            {/* Add more systems as needed */}
          </select>
        </div>
        <div>
          <label htmlFor="dosageText">Dosage Instructions:</label>
          <select
            id="dosageText"
            value={dosageText}
            onChange={(e) => setDosageText(e.target.value)}
            required
          >
            <option value="">Select Dosage Instructions</option>
            <option value="Take 1 capsule daily.">Take 1 capsule daily.</option>
            <option value="Take 2 capsules daily with food.">Take 2 capsules daily with food.</option>
            <option value="Apply topically twice a day.">Apply topically twice a day.</option>
            <option value="Take 1 tablet in the morning.">Take 1 tablet in the morning.</option>
            {/* Add more dosage options as needed */}
          </select>
        </div>
        <div>
          <label htmlFor="requesterDisplay">Requester Name:</label>
          <input
            type="text"
            id="requesterDisplay"
            value={requesterDisplay}
            readOnly
            required
          />
        </div>
        <button type="submit">Send Request</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
}

export default SendMedicationRequestPage; 