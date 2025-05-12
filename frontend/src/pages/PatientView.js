import React from "react";
import { useParams } from "react-router-dom";

const dummyPatients = {
  1: { name: "Alice Smith", age: 30, notes: "No allergies." },
  2: { name: "Bob Johnson", age: 45, notes: "Diabetic." },
  3: { name: "Charlie Brown", age: 25, notes: "Vegetarian." }
};

export default function PatientView() {
  const { id } = useParams();
  const patient = dummyPatients[id];

  if (!patient) {
    return <div>Patient not found.</div>;
  }

  return (
    <div>
      <h2>Patient Details</h2>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Notes:</strong> {patient.notes}</p>
    </div>
  );
}