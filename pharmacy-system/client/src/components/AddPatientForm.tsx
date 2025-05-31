import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Patient.css'; // Use the same CSS file for form styling

interface AddPatientFormProps {
  onSuccess: () => void; // Callback function to refresh list and hide form on success
}

const AddPatientForm: React.FC<AddPatientFormProps> = ({ onSuccess }) => {
  // Form input states
  const [fhirId, setFhirId] = useState<string>('');
  const [givenName, setGivenName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!givenName || !familyName || !gender || !birthDate) {
      alert('Please fill in all required fields (Given Name, Family Name, Gender, Birth Date).');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/patients', {
        fhirId: fhirId || undefined, // Optional FHIR ID
        name: {
          given: [givenName],
          family: familyName,
        },
        gender: gender,
        birthDate: birthDate,
        // Add other relevant patient fields from form here later
      });

      alert('Patient added successfully!');
      // Clear form
      setFhirId('');
      setGivenName('');
      setFamilyName('');
      setGender('');
      setBirthDate('');

      onSuccess(); // Call the callback

    } catch (err) {
      console.error('Error adding patient:', err);
      alert('Failed to add patient. Please try again.');
    }
  };

  return (
    <div className="add-patient-form">
      <h3>Add New Patient</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fhirId">FHIR ID (Optional):</label>
          <input type="text" id="fhirId" value={fhirId} onChange={(e) => setFhirId(e.target.value)} />
        </div>
        <div>
          <label htmlFor="givenName">Given Name:</label>
          <input type="text" id="givenName" value={givenName} onChange={(e) => setGivenName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="familyName">Family Name:</label>
          <input type="text" id="familyName" value={familyName} onChange={(e) => setFamilyName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
           <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="birthDate">Birth Date:</label>
          <input type="date" id="birthDate" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
        </div>
        {/* Add other relevant patient fields here later */}
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
};

export default AddPatientForm; 