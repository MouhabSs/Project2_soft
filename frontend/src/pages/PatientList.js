import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import { FaSearch, FaUserEdit, FaEye } from "react-icons/fa";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/patients")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch patients");
        }
        return res.json();
      })
      .then(result => {
        if (!result.success) {
          throw new Error(result.message || "Failed to fetch patients");
        }
        setPatients(result.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Alphabetical sort and search filter
  const filteredPatients = patients
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <NavBar />
      <div className="patientlist-container">
        <h2>Patient List</h2>
        <div className="patientlist-searchbar">
          <FaSearch  className="patientlist-search-icon" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="patientlist-search-input"
            aria-label="Search patients by name"
            style={{ fontSize: "1em", height: "2em", width: "80%" }}
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>Error: {error}</div>
        ) : filteredPatients.length === 0 ? (
          <div>No patients found.</div>
        ) : (
          <ul className="patientlist-list"> 
            {filteredPatients.map(patient => (
              <li key={patient._id} className="patientlist-item">
                <span className="patientlist-name" style={{ fontSize: "2em", fontWeight: "bold" }}>{patient.name}</span>
                <div className="patientlist-actions">
                  <Link to={`/patients/${patient._id}`} className="patientlist-action-btn" title="View patient"><FaEye style={{ fontSize: "2em" }} /></Link>
                  <Link to={`/patients/${patient._id}/edit`} className="patientlist-action-btn" title="Edit patient"><FaUserEdit style={{ fontSize: "2em" }} /></Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link to="/patients/add" className="patientlist-add-btn">+ Add Patient</Link>
      </div>
    </>
  );
}