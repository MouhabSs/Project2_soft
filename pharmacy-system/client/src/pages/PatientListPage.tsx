import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Patient.css'; // We will create this CSS file next
import AddPatientForm from '../components/AddPatientForm'; // Import AddPatientForm
import PatientItem from '../components/PatientItem'; // Assuming you have a PatientItem component

interface Patient {
  _id: string;
  fhirId?: string;
  name?: {
    given: string[];
    family: string;
  };
  gender?: string;
  birthDate?: string;
  // Add other relevant patient fields
}

const PatientListPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false); // State to toggle form visibility

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Patient[]>('http://localhost:5001/api/patients');
      setPatients(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    fetchPatients(); // Refresh the list
    setShowAddForm(false); // Hide the form
  };

  if (loading) {
    return <div>Loading patients...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="patient-list-page">
      <h2>Pharmacy Patients</h2>

      {/* Button to toggle Add Patient Form */}
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Cancel Add Patient' : 'Add New Patient'}
      </button>

      {/* Add Patient Form */}
      {showAddForm && (
        <AddPatientForm onSuccess={handleAddSuccess} />
      )}

      {/* Patient List */}
      {patients.length === 0 && !showAddForm ? (
        <p>No patients found.</p>
      ) : (
        <div className="patient-list">
          {patients.map((patient) => (
            <PatientItem key={patient._id} patient={patient} onRemoveSuccess={fetchPatients} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientListPage; 