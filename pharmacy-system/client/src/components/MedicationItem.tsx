import React from 'react';
import axios from 'axios';

interface MedicationItemProps {
  medication: {
    _id: string;
    fhirId?: string;
    code?: {
      coding: [{
        system?: string;
        code?: string;
        display?: string;
      }]
    };
    name: string; // Assuming a 'name' field for display
    // Add other relevant Medication fields
  };
}

const MedicationItem: React.FC<MedicationItemProps> = ({ medication }) => {
  return (
    <div className="medication-item">
      <p><strong>Name:</strong> {medication.name || medication.code?.coding?.[0]?.display || 'N/A'}</p>
      <p><strong>FHIR ID:</strong> {medication.fhirId || 'N/A'}</p>
      {/* Display other relevant medication details */}
    </div>
  );
};

export default MedicationItem; 