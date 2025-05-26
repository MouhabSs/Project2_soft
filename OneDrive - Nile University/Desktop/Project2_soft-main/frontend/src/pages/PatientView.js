import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars, FaNotesMedical, FaTrash, FaEdit } from "react-icons/fa";
import { patientApi } from "../services/api";
import { toast } from "react-toastify";
import "../styles/global.css";
import axios from "axios";

export default function PatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState(null);

  useEffect(() => {
    fetchPatient();
    fetchNutritionPlans();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await patientApi.getById(id);
      setPatient(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch patient";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchNutritionPlans = async () => {
    setLoadingPlans(true);
    setPlansError(null);
    try {
      const response = await axios.get(`/api/nutrition-plans?patientId=${id}`);
      setNutritionPlans(response.data);
    } catch (err) {
      setPlansError("Failed to fetch nutrition plans");
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleDelete = async () => {
    try {
      await patientApi.delete(id);
      toast.success("Patient deleted successfully");
      navigate("/patients");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete patient";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
            Loading patient information...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{ textAlign: "center", padding: "var(--spacing-xl)", color: "var(--error-color)" }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
            Patient not found
          </div>
        </div>
      </div>
    );
  }

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
            <h1 style={{ color: "var(--primary-color)" }}>Patient Details</h1>
            <div style={{
              display: "flex",
              gap: "var(--spacing-md)"
            }}>
              <Link
                to={`/patients/${id}/edit`}
                className="btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)",
                  color: "var(--primary-color)"
                }}
              >
                <FaEdit /> Edit
              </Link>
              <button
                className="btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)",
                  color: "var(--error-color)"
                }}
                onClick={() => setShowDeleteModal(true)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>

          <div style={{
            display: "grid",
            gap: "var(--spacing-lg)"
          }}>
            <div style={{
              backgroundColor: "var(--background-secondary)",
              padding: "var(--spacing-lg)",
              borderRadius: "var(--border-radius)"
            }}>
              <h3 style={{
                margin: "0 0 var(--spacing-md) 0",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)"
              }}>
                <FaUser /> Personal Information
              </h3>
              <div style={{
                display: "grid",
                gap: "var(--spacing-md)"
              }}>
                <div>
                  <label style={{ color: "var(--text-secondary)" }}>Name</label>
                  <p style={{ margin: "var(--spacing-xs) 0 0 0" }}>{patient.name}</p>
                </div>
                <div>
                  <label style={{ color: "var(--text-secondary)" }}>Email</label>
                  <p style={{ margin: "var(--spacing-xs) 0 0 0" }}>{patient.email}</p>
                </div>
                <div>
                  <label style={{ color: "var(--text-secondary)" }}>Phone</label>
                  <p style={{ margin: "var(--spacing-xs) 0 0 0" }}>{patient.phone}</p>
                </div>
                <div>
                  <label style={{ color: "var(--text-secondary)" }}>Age</label>
                  <p style={{ margin: "var(--spacing-xs) 0 0 0" }}>{patient.age}</p>
                </div>
                <div>
                  <label style={{ color: "var(--text-secondary)" }}>Gender</label>
                  <p style={{ margin: "var(--spacing-xs) 0 0 0" }}>{patient.gender}</p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: "var(--background-secondary)",
              padding: "var(--spacing-lg)",
              borderRadius: "var(--border-radius)"
            }}>
              <h3 style={{
                margin: "0 0 var(--spacing-md) 0",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)"
              }}>
                <FaNotesMedical /> Medical History
              </h3>
              <div>
                <label style={{ color: "var(--text-secondary)" }}>Medical History</label>
                <p style={{ margin: "var(--spacing-xs) 0 0 0" }}>{patient.medicalHistory || "No medical history recorded"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Plans Section */}
      <div className="container" style={{ paddingTop: 0 }}>
        <div className="card">
          <h2 style={{ color: "var(--primary-color)", marginBottom: "var(--spacing-md)" }}>Nutrition Plans</h2>
          {loadingPlans ? (
            <div style={{ textAlign: "center", padding: "var(--spacing-lg)" }}>Loading nutrition plans...</div>
          ) : plansError ? (
            <div style={{ color: "var(--error-color)", textAlign: "center" }}>{plansError}</div>
          ) : nutritionPlans.length === 0 ? (
            <div style={{ color: "var(--text-secondary)", textAlign: "center" }}>No nutrition plans found for this patient.</div>
          ) : (
            <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
              {nutritionPlans.map(plan => (
                <div key={plan._id} className="card" style={{ background: "#2c2f36", padding: "var(--spacing-md)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{plan.planType || "Nutrition Plan"}</h4>
                      <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                        Created: {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : "-"}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "var(--spacing-md)" }}>
                    <strong>Meal Plan:</strong>
                    <div style={{ whiteSpace: "pre-line", color: "#b6c6e3" }}>{plan.mealPlan || "-"}</div>
                  </div>
                  {plan.notes && (
                    <div style={{ marginTop: "var(--spacing-sm)", color: "#b6c6e3" }}><strong>Notes:</strong> {plan.notes}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div className="card" style={{
            width: "100%",
            maxWidth: "400px",
            padding: "var(--spacing-xl)"
          }}>
            <h3 style={{ margin: "0 0 var(--spacing-md) 0" }}>Delete Patient</h3>
            <p style={{ margin: "0 0 var(--spacing-lg) 0" }}>
              Are you sure you want to delete this patient? This action cannot be undone.
            </p>
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--spacing-md)"
            }}>
              <button
                className="btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{ color: "var(--error-color)" }}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}