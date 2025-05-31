import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Medication.css'; // Use the same CSS file for form styling

interface AddMedicationFormProps {
  onSuccess: () => void; // Callback function to refresh list and hide form on success
}

const AddMedicationForm: React.FC<AddMedicationFormProps> = ({ onSuccess }) => {
  // Form input states
  const [fhirId, setFhirId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [system, setSystem] = useState<string>('');
  const [code, setCode] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!fhirId || !name || !system || !code) {
      alert('Please fill in all required fields (FHIR ID, Name, System, Code).');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/medications', {
        fhirId: fhirId,
        name: name,
        code: {
          coding: [{
            system: system,
            code: code,
            display: name,
          }],
        },
        // Add other relevant medication fields from form here later
      });

      alert('Medication added successfully!');
      // Clear form
      setFhirId('');
      setName('');
      setSystem('');
      setCode('');

      onSuccess(); // Call the callback to refresh the list and hide the form

    } catch (err) {
      console.error('Error adding medication:', err);
      alert('Failed to add medication. Please try again.');
    }
  };

  return (
    <div className="add-medication-form">
      <h3>Add New Medication</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fhirId">FHIR ID:</label>
          <input type="text" id="fhirId" value={fhirId} onChange={(e) => setFhirId(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="system">System:</label>
          <input type="text" id="system" value={system} onChange={(e) => setSystem(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="code">Code:</label>
          <input type="text" id="code" value={code} onChange={(e) => setCode(e.target.value)} required />
        </div>
        {/* Add other relevant medication fields here later */}
        <button type="submit">Add Medication</button>
      </form>
    </div>
  );
};

export default AddMedicationForm; 