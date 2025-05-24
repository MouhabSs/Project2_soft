import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import { FaSearch, FaUserEdit, FaEye, FaPlus, FaSpinner } from "react-icons/fa";
import "../styles/global.css";

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

          <div style={{
            position: "relative",
            marginBottom: "var(--spacing-xl)"
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
              No patients found.
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