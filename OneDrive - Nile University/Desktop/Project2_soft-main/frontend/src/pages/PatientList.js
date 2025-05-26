import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import { FaSearch, FaUserEdit, FaEye, FaPlus, FaSpinner, FaFilter, FaTimes, FaFileExport } from "react-icons/fa";
import { patientApi } from "../services/api";
import { toast } from "react-toastify";
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

  // Add quick search state
  const [quickSearch, setQuickSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await patientApi.getAll();
        setPatients(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to fetch patients";
        setError(errorMessage);
        toast.error(errorMessage);
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

  // Enhanced filter function
  const filteredPatients = patients
    .filter(patient => {
      const searchTerm = (quickSearch || search).toLowerCase();
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.email?.toLowerCase().includes(searchTerm) ||
        patient.medicalConditions?.some(condition => 
          condition.toLowerCase().includes(searchTerm)
        );
      const matchesAge = !ageFilter || patient.age.toString() === ageFilter;
      const matchesGender = !genderFilter || patient.gender === genderFilter;
      const matchesConditions = medicalConditionsFilter.length === 0 || 
        medicalConditionsFilter.some(condition => 
          patient.medicalConditions?.includes(condition)
        );
      
      return matchesSearch && matchesAge && matchesGender && matchesConditions;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Add export functionality
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Age', 'Gender', 'Medical Conditions'];
    const csvData = filteredPatients.map(patient => [
      patient.name,
      patient.email || '',
      patient.age,
      patient.gender,
      patient.medicalConditions?.join(', ') || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
              <button
                onClick={exportToCSV}
                className="btn btn-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)"
                }}
                title="Export to CSV"
              >
                <FaFileExport /> Export
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)"
                }}
              >
                {showFilters ? <FaTimes /> : <FaFilter />}
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              <Link to="/patients/add" className="btn btn-primary" style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)"
              }}>
                <FaPlus /> Add Patient
              </Link>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div style={{
            marginBottom: "var(--spacing-lg)",
            position: "relative"
          }}>
            <FaSearch style={{
              position: "absolute",
              left: "var(--spacing-md)",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-secondary)"
            }} />
            <input
              type="text"
              placeholder="Quick search by name, email, or medical condition..."
              value={quickSearch}
              onChange={e => setQuickSearch(e.target.value)}
              style={{
                paddingLeft: "calc(var(--spacing-md) * 2 + 16px)",
                width: "100%",
                fontSize: "1.1rem",
                padding: "var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                background: "#23272f",
                color: "#e0eafc",
                border: "1px solid #414345",
                transition: "all 0.3s ease"
              }}
              aria-label="Quick search patients"
            />
          </div>

          {/* Advanced Filters Section */}
          {showFilters && (
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
          )}

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