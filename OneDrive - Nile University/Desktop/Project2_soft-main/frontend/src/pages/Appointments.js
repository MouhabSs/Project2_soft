import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { FaCalendarAlt, FaClock, FaUser, FaPlus, FaTimes } from "react-icons/fa";
import { appointmentApi, patientApi } from "../services/api";
import { toast } from "react-toastify";
import "../styles/global.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    date: "",
    time: "",
    notes: ""
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentApi.getAll();
      setAppointments(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch appointments";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientApi.getAll();
      setPatients(response.data);
    } catch (err) {
      toast.error("Failed to fetch patients");
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const selectedPatient = patients.find(p => p.id === newAppointment.patientId);
      const appointmentData = {
        ...newAppointment,
        patientName: selectedPatient.name
      };
      const response = await appointmentApi.create(appointmentData);
      setAppointments(prev => [...prev, response.data]);
      setShowAddModal(false);
      setNewAppointment({
        patientId: "",
        date: "",
        time: "",
        notes: ""
      });
      toast.success("Appointment added successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to add appointment";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
            Loading appointments...
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
            <h1 style={{ color: "var(--primary-color)" }}>Appointments</h1>
            <button 
              className="btn btn-primary" 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)"
              }}
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus /> Add Appointment
            </button>
          </div>

          {appointments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--spacing-xl)", color: "var(--text-secondary)" }}>
              No appointments scheduled
            </div>
          ) : (
            <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
              {appointments.map(appointment => (
                <div key={appointment.id} className="card" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "var(--spacing-lg)"
                }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{appointment.patientName}</h3>
                    <p style={{
                      color: "var(--text-secondary)",
                      margin: "var(--spacing-xs) 0 0 0"
                    }}>
                      <FaCalendarAlt style={{ marginRight: "var(--spacing-xs)" }} />
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p style={{
                      color: "var(--text-secondary)",
                      margin: "var(--spacing-xs) 0 0 0"
                    }}>
                      <FaClock style={{ marginRight: "var(--spacing-xs)" }} />
                      {appointment.time}
                    </p>
                    {appointment.notes && (
                      <p style={{
                        color: "var(--text-secondary)",
                        margin: "var(--spacing-xs) 0 0 0"
                      }}>
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "var(--spacing-sm)"
                  }}>
                    <button
                      className="btn"
                      style={{
                        background: "none",
                        color: "var(--primary-color)"
                      }}
                    >
                      <FaUser size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
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
            maxWidth: "500px",
            padding: "var(--spacing-xl)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--spacing-lg)"
            }}>
              <h2 style={{ margin: 0 }}>Add New Appointment</h2>
              <button
                className="btn"
                style={{
                  background: "none",
                  color: "var(--text-secondary)"
                }}
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)"
            }}>
              <div>
                <label style={{ display: "block", marginBottom: "var(--spacing-xs)" }}>
                  Patient
                </label>
                <select
                  value={newAppointment.patientId}
                  onChange={(e) => setNewAppointment(prev => ({
                    ...prev,
                    patientId: e.target.value
                  }))}
                  required
                  style={{ width: "100%" }}
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "var(--spacing-xs)" }}>
                  Date
                </label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "var(--spacing-xs)" }}>
                  Time
                </label>
                <input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment(prev => ({
                    ...prev,
                    time: e.target.value
                  }))}
                  required
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "var(--spacing-xs)" }}>
                  Notes
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  style={{ width: "100%", minHeight: "100px" }}
                />
              </div>

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--spacing-md)",
                marginTop: "var(--spacing-md)"
              }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}