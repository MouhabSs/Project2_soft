import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MedicationRequestItem from './MedicationRequestItem';
import '../styles/MedicationRequest.css'; // Import the CSS file

interface Medication {
  _id: string;
  fhirId?: string;
  code?: { coding: [{ display?: string }] };
  // Add other relevant Medication fields you might need for display
}

interface Patient {
  _id: string;
  fhirId?: string;
  name?: {
    given: string[];
    family: string;
  };
  // Add other relevant patient fields you might need for display
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
  subject?: { // Original FHIR reference
    reference: string;
    display: string;
  };
  patientRef?: Patient; // Populated internal Patient object
  requester?: { // Original FHIR reference
    reference: string;
    display: string;
  };
  dosageInstruction?: [{ text?: string }];
}

const MedicationRequestList: React.FC = () => {
  const [medicationRequests, setMedicationRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicationRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/medication-requests');
      setMedicationRequests(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicationRequests();
  }, []);

  if (loading) {
    return <div>Loading medication requests...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="medication-request-list-page">
      <h2>Medication Requests</h2>
      {medicationRequests.length === 0 ? (
        <p>No medication requests found.</p>
      ) : (
        <div className="medication-requests-list">
          {medicationRequests.map((request) => (
            <MedicationRequestItem
              key={request._id}
              request={request}
              onDispenseSuccess={fetchMedicationRequests}
            />
          ))
          }
        </div>
      )
      }
    </div>
  );
};

export default MedicationRequestList; 