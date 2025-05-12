import React from "react";
import { Link } from "react-router-dom";

const dummyPatients = [
  { id: 1, name: "Alice Smith" },
  { id: 2, name: "Bob Johnson" },
  { id: 3, name: "Charlie Brown" }
];

export default function PatientList() {
  return (
    <div>
      <h2>Patient List</h2>
      <ul>
        {dummyPatients.map(patient => (
          <li key={patient.id}>
            <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}