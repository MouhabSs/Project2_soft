import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

const dummyPatients = [
  { id: 1, name: "Alice Smith" },
  { id: 2, name: "Bob Johnson" },
  { id: 3, name: "Charlie Brown" }
];

export default function PatientList() {
  return (
    <>
      <NavBar />
      <div className="patientlist-container">
      <h2>Patient List</h2>
      <ul className="patientlist-list">
        {dummyPatients.map(patient => (
          <li key={patient.id} className="patientlist-item">
            <Link to={`/patients/${patient.id}`} className="patientlist-link">{patient.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/patients/add" className="patientlist-add-btn">+ Add Patient</Link>
    </div>
    </>
  );
}