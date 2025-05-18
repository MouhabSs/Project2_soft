import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "./NavBar";

export default function PatientView() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/patients/${id}`)
      .then(res => res.json())
      .then(data => {
        setPatient(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="patientview-container"><div>Loading...</div></div>;
  if (!patient || patient.error) return <div className="patientview-container"><div className="patientview-notfound">Patient not found.</div></div>;

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