import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

export default function PatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    setError(null);
    fetch(`/api/patients/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch patient");
        return res.json();
      })
      .then(result => {
        if (!result.success) {
          setPatient(null);
          setError(result.message || "Patient not found.");
        } else {
          setPatient(result.data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Error loading patient");
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to delete patient");
      }
      navigate("/patients");
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <div className="patientview-container"><div>Loading...</div></div>;
  if (error) return <div className="patientview-container"><div className="patientview-notfound">{error}</div></div>;
  if (!patient) return <div className="patientview-container"><div className="patientview-notfound">Patient not found.</div></div>;

  return (
    <>
      <NavBar />
      <div className="patientview-container">
        <h2>Patient Details</h2>
        <div className="patientview-card">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Email:</strong> {patient.email || <span style={{color:"#888"}}>N/A</span>}</p>
          <p><strong>Phone:</strong> {patient.phone || <span style={{color:"#888"}}>N/A</span>}</p>
          <p><strong>Dietary Restrictions:</strong> {
            Array.isArray(patient.dietaryRestrictions)
              ? (patient.dietaryRestrictions.length > 0
                  ? patient.dietaryRestrictions.join(", ")
                  : <span style={{color:"#888"}}>N/A</span>)
              : (patient.dietaryRestrictions || <span style={{color:"#888"}}>N/A</span>)
          }</p>
          <p><strong>Physical Activity Level:</strong> {patient.physicalActivityLevel || <span style={{color:"#888"}}>N/A</span>}</p>
          <p><strong>Medical Conditions:</strong> {
            Array.isArray(patient.medicalConditions)
              ? (patient.medicalConditions.length > 0
                  ? patient.medicalConditions.join(", ")
                  : <span style={{color:"#888"}}>N/A</span>)
              : (patient.medicalConditions || <span style={{color:"#888"}}>N/A</span>)
          }</p>
          <p><strong>Notes:</strong> {patient.notes || <span style={{color:"#888"}}>N/A</span>}</p>
        </div>
        <button
          className="addpatient-btn"
          style={{ background: "#ff6b6b", marginRight: "1rem" }}
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Patient"}
        </button>
        {deleteError && <div style={{ color: "red", marginTop: "0.5rem" }}>{deleteError}</div>}
        <Link to="/patients" className="patientview-back">← Back to Patient List</Link>
      </div>
    </>
  );
}