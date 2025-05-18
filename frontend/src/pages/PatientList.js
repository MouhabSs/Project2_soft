import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/patients")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch patients");
        }
        return res.json();
      })
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <NavBar />
      <div className="patientlist-container">
        <h2>Patient List</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>Error: {error}</div>
        ) : (
          <ul className="patientlist-list">
            {patients.map(patient => (
              <li key={patient._id} className="patientlist-item">
                <Link to={`/patients/${patient._id}`} className="patientlist-link">{patient.name}</Link>
              </li>
            ))}
          </ul>
        )}
        <Link to="/patients/add" className="patientlist-add-btn">+ Add Patient</Link>
      </div>
    </>
  );
}