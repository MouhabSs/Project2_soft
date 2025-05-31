import React from 'react';
import axios from 'axios';
import '../styles/MedicationRequest.css';

interface Medication {
  _id: string;
  fhirId?: string;
  code?: {
    coding: [{
      system?: string;
      code?: string;
      display?: string;
    }]
  };
  name: string;
}

interface Patient {
  _id: string;
  fhirId?: string;
  name?: {
    given: string[];
    family: string;
  };
}

interface MedicationRequest {
  _id: string;
  fhirId?: string;
  status?: string;
  intent?: string;
  medicationReference?: { // Original FHIR reference
    reference: string;
    display: string;
  };
  medicationRef?: Medication; // Populated internal Medication object
  medicationDisplayString?: string; // New field to store display text from codeableConcept
  subject?: {
    reference: string;
    display: string;
  };
  patientRef?: Patient; // Populated internal Patient object
  requester?: {
    reference: string;
    display: string;
  };
  dosageInstruction?: [{ text?: string }];
}

interface MedicationRequestItemProps {
  request: MedicationRequest;
  onDispenseSuccess: () => void;
}

const MedicationRequestItem: React.FC<MedicationRequestItemProps> = ({ request, onDispenseSuccess }) => {
  const handleDispense = async () => {
    try {
      const response = await axios.post(`http://localhost:5001/api/medication-requests/dispense/${request._id}`);
      console.log('Dispense successful:', response.data);
      onDispenseSuccess();
    } catch (error) {
      console.error('Failed to dispense medication:', error);
      alert('Failed to dispense medication. Please try again.');
    }
  };

  // Helper to display patient name
  const displayPatientName = () => {
    if (request.patientRef?.name && request.patientRef.name.given && request.patientRef.name.family) {
      return `${request.patientRef.name.given.join(' ')} ${request.patientRef.name.family}`;
    } else if (request.patientRef?.name?.given) {
        return request.patientRef.name.given.join(' ');
    } else if (request.patientRef?.name?.family) {
        return request.patientRef.name.family;
    } else if (request.subject?.display) {
        return request.subject.display;
    }
    return 'N/A';
  };

  return (
    <div className={`medication-request-item ${request.status?.toLowerCase()}`}>
      <div className="request-header">
        <div className="request-id"><strong>FHIR ID:</strong> {request.fhirId || 'N/A'}</div>
        <div className="request-status"><strong>Status:</strong> {request.status || 'N/A'}</div>
      </div>
      <div className="request-details">
        <p><strong>Intent:</strong> {request.intent || 'N/A'}</p>
        <p><strong>Medication:</strong> {request.medicationDisplayString || request.medicationRef?.name || request.medicationRef?.code?.coding?.[0]?.display || request.medicationReference?.display || 'N/A'} {request.medicationRef && `(Internal ID: ${request.medicationRef._id})`}</p>
        <p><strong>Subject (Patient):</strong> {displayPatientName()} {request.patientRef && `(Internal ID: ${request.patientRef._id})`}</p>
        <p><strong>Requester:</strong> {request.requester?.display || 'N/A'}</p>
        <p><strong>Dosage:</strong> {request.dosageInstruction?.[0]?.text || 'N/A'}</p>
        {/* Add other relevant fields */}
      </div>
      <div className="request-actions">
        {request.status !== 'dispensed' && (
          <button onClick={handleDispense} className="dispense-button">Dispense</button>
        )}
        {/* Add Remove button back here if desired later */}
      </div>
    </div>
  );
};

export default MedicationRequestItem; 