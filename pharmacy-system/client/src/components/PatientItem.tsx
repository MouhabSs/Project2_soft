import React from 'react';
import axios from 'axios';

interface PatientItemProps {
  patient: {
    _id: string;
    fhirId?: string;
    name?: {
      given: string[];
      family: string;
    };
    // Add other relevant patient fields
  };
  onRemoveSuccess: () => void; // Callback to refresh the list
}

const PatientItem: React.FC<PatientItemProps> = ({ patient, onRemoveSuccess }) => {
    const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove this patient?')) {
      try {
        await axios.delete(`http://localhost:5001/api/patients/${patient._id}`);
        console.log('Patient removed successfully');
        onRemoveSuccess(); // Refresh list after removal
      } catch (error) {
        console.error('Failed to remove patient:', error);
        alert('Failed to remove patient. Please try again.');
      }
    }
  };

  // Helper to display patient name
  const displayPatientName = () => {
    if (patient.name && patient.name.given && patient.name.family) {
      return `${patient.name.given.join(' ')} ${patient.name.family}`;
    } else if (patient.name && patient.name.given) {
        return patient.name.given.join(' ');
    } else if (patient.name && patient.name.family) {
        return patient.name.family;
    }
    return 'N/A';
  };

  return (
    <div className="patient-item">
      <p><strong>Name:</strong> {displayPatientName()}</p>
      <p><strong>FHIR ID:</strong> {patient.fhirId || 'N/A'}</p>
      {/* Display other relevant patient details */}
       <button onClick={handleRemove} style={{ marginLeft: '10px' }}>Remove</button>
    </div>
  );
};

export default PatientItem; 