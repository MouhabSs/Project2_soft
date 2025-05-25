import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import { FaSearch, FaUserEdit, FaEye, FaPlus, FaSpinner, FaFilter } from "react-icons/fa";
import "../styles/global.css";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  // State for filters
  const [ageFilter, setAgeFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [medicalConditionsFilter, setMedicalConditionsFilter] = useState([]);

  // Medical options (copying from AddPatient for consistency)
  const MEDICAL_OPTIONS = [
    "Diabetes", "Hypertension", "High Cholesterol", "Obesity",
    "Celiac Disease", "Thyroid Disorder", "Kidney Disease", "Other"
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/patients");
        if (!res.ok) {
          throw new Error("Failed to fetch patients");
        }
        const result = await res.json();
        if (!result.success) {
          throw new Error(result.message || "Failed to fetch patients");
        }
        setPatients(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle medical conditions checkbox change
  const handleMedicalConditionChange = (condition) => {
    setMedicalConditionsFilter(prev =>
      prev.includes(condition)
        ? prev.filter(item => item !== condition)
        : [...prev, condition]
    );
  };

  // Filter patients based on search and other filters
  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(search.toLowerCase());
      const matchesAge = !ageFilter || patient.age.toString() === ageFilter;
      const matchesGender = !genderFilter || patient.gender === genderFilter;
      const matchesConditions = medicalConditionsFilter.length === 0 || 
        medicalConditionsFilter.some(condition => 
          patient.medicalConditions?.includes(condition)
        );
      
      return matchesSearch && matchesAge && matchesGender && matchesConditions;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <NavBar />
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--spacing-lg)"
          }}>
            <h1 style={{ color: "var(--primary-color)" }}>Patient List</h1>
            <Link to="/patients/add" className="btn btn-primary" style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)"
            }}>
              <FaPlus /> Add Patient
            </Link>
          </div>

          {/* Search and Filter Section */}
          <div style={{
            marginBottom: "var(--spacing-xl)",
            background: "#2c2f36",
            padding: "var(--spacing-md)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-md)"
          }}>
            <h2 style={{ fontSize: "1.2rem", color: "#e0eafc", marginBottom: "var(--spacing-sm)" }}>
              <FaFilter style={{ marginRight: "var(--spacing-sm)" }} /> Filters
            </h2>
            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <FaSearch style={{
                position: "absolute",
                left: "var(--spacing-md)",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)"
              }} />
              <input
                type="text"
                placeholder="Search patients by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  paddingLeft: "calc(var(--spacing-md) * 2 + 16px)",
                  width: "100%"
                }}
                aria-label="Search patients by name"
              />
            </div>

            {/* Age and Gender Filters */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
              <div>
                <label style={{ display: "block", marginBottom: "var(--spacing-xs)", color: "#b6c6e3", fontSize: "var(--font-size-sm)" }}>Age Filter:</label>
                <input
                  type="number"
                  value={ageFilter}
                  onChange={e => setAgeFilter(e.target.value)}
                  placeholder="Enter age"
                  style={{
                    width: "100%",
                    padding: "var(--spacing-sm)",
                    borderRadius: "var(--radius-md)",
                    background: "#23272f",
                    color: "#e0eafc",
                    border: "1px solid #414345",
                    fontSize: "var(--font-size-base)"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "var(--spacing-xs)", color: "#b6c6e3", fontSize: "var(--font-size-sm)" }}>Gender:</label>
                <select
                  value={genderFilter}
                  onChange={e => setGenderFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "var(--spacing-sm)",
                    borderRadius: "var(--radius-md)",
                    background: "#23272f",
                    color: "#e0eafc",
                    border: "1px solid #414345",
                    fontSize: "var(--font-size-base)"
                  }}
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Medical Conditions Filter */}
            <div>
              <label style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "#b6c6e3", fontSize: "var(--font-size-sm)" }}>Medical Conditions (select multiple):</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "var(--spacing-sm)" }}>
                {MEDICAL_OPTIONS.map(condition => (
                  <label key={condition} className="checkbox-label" style={{fontSize: "var(--font-size-sm)", color: "var(--text-primary)"}}>
                    <input
                      type="checkbox"
                      checked={medicalConditionsFilter.includes(condition)}
                      onChange={() => handleMedicalConditionChange(condition)}
                    />
                    <span>{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "var(--spacing-xl)"
            }}>
              <FaSpinner style={{
                fontSize: "2rem",
                color: "var(--primary-color)",
                animation: "spin 1s linear infinite"
              }} />
            </div>
          ) : error ? (
            <div className="card" style={{
              backgroundColor: "var(--error-color)",
              color: "white",
              padding: "var(--spacing-md)"
            }}>
              Error: {error}
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="card" style={{
              textAlign: "center",
              padding: "var(--spacing-xl)",
              color: "var(--text-secondary)"
            }}>
              No patients found matching your criteria.
            </div>
          ) : (
            <div style={{
              display: "grid",
              gap: "var(--spacing-md)"
            }}>
              {filteredPatients.map(patient => (
                <div key={patient._id} className="card" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "var(--spacing-lg)"
                }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{patient.name}</h3>
                    {patient.email && (
                      <p style={{
                        color: "var(--text-secondary)",
                        margin: "var(--spacing-xs) 0 0 0"
                      }}>
                        {patient.email}
                      </p>
                    )}
                    <p style={{
                      color: "var(--text-secondary)",
                      margin: "var(--spacing-xs) 0 0 0"
                    }}>
                      Age: {patient.age}, Gender: {patient.gender}
                    </p>
                    {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                      <p style={{
                        color: "var(--text-secondary)",
                        margin: "var(--spacing-xs) 0 0 0"
                      }}>
                        Conditions: {patient.medicalConditions.join(", ")}
                      </p>
                    )}
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "var(--spacing-sm)"
                  }}>
                    <Link
                      to={`/patients/${patient._id}`}
                      className="btn"
                      style={{
                        background: "none",
                        color: "var(--primary-color)"
                      }}
                      title="View patient"
                    >
                      <FaEye size={20} />
                    </Link>
                    <Link
                      to={`/patients/${patient._id}/edit`}
                      className="btn"
                      style={{
                        background: "none",
                        color: "var(--primary-color)"
                      }}
                      title="Edit patient"
                    >
                      <FaUserEdit size={20} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}