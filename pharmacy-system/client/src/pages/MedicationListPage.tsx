import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddMedicationForm from '../components/AddMedicationForm'; // Import AddMedicationForm
import '../styles/Medication.css'; // Assuming you have a CSS file for medications

interface Medication {
  _id: string;
  fhirId?: string;
  code?: { coding: [{ display?: string }] };
  name: string;
}

const MedicationListPage: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchMedications = async () => {
    try {
      const response = await axios.get<Medication[]>('http://localhost:5001/api/medications');
      setMedications(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleAddSuccess = () => {
    fetchMedications(); // Refresh the list
    setShowAddForm(false); // Hide the form
  };

  if (loading) {
    return <div>Loading medications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="medication-list-page">
      <h2>Pharmacy Medications</h2>

      {/* Button to toggle Add Medication Form */}
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Cancel Add Medication' : 'Add New Medication'}
      </button>

      {/* Add Medication Form */}
      {showAddForm && (
        <AddMedicationForm onSuccess={handleAddSuccess} />
      )}

      {/* Medication List */}
      {medications.length === 0 && !showAddForm ? (
        <p>No medications found.</p>
      ) : (
        <div className="medication-list">
          {medications.map((med) => (
            <div key={med._id} className="medication-item">
              <p><strong>FHIR ID:</strong> {med.fhirId || 'N/A'}</p>
              <p><strong>Name:</strong> {med.name || med.code?.coding?.[0]?.display || 'N/A'}</p>{/* Display name or code.display */}
              {/* Display other relevant medication details here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationListPage; 