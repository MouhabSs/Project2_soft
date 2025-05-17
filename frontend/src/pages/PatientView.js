import React from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "./NavBar";

const dummyPatients = {
  1: { name: "Alice Smith", age: 30, notes: "No allergies." },
  2: { name: "Bob Johnson", age: 45, notes: "Diabetic." },
  3: { name: "Charlie Brown", age: 25, notes: "Vegetarian." }
};

export default function PatientView() {
  const { id } = useParams();
  const patient = dummyPatients[id];

  if (!patient) {
    return <div className="patientview-container"><div className="patientview-notfound">Patient not found.</div></div>;
  }

  return (
    <>
      <NavBar />
      <div className="patientview-container">
      <h2>Patient Details</h2>
      <div className="patientview-card">
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Notes:</strong> {patient.notes}</p>
      </div>
      <Link to="/patients" className="patientview-back">← Back to Patient List</Link>
    </div>
    </>
  );
}