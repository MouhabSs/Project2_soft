import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Modal from "../components/Modal";
import Tooltip from "../components/Tooltip";
import { FaCalendarAlt, FaClock, FaUser, FaStickyNote } from "react-icons/fa";
import "../styles/global.css";

export default function Appointments() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notes, setNotes] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Fetch patients for dropdown
    fetch("/api/patients")
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setPatients(result.data);
        } else {
          setError(result.message || "Failed to fetch patients");
        }
      })
      .catch(err => setError(err.message || "Failed to fetch patients"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!patientId || !date || !time) {
      setError("All fields are required.");
      return;
    }
    if (date <= today) {
      setError("Appointment date must be after today.");
      return;
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, date, time, notes }),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.message || result.error || "Failed to set appointment");
      }
      setSuccess("Appointment set successfully!");
      setShowSuccessModal(true);
      setPatientId("");
      setDate("");
      setTime("");
      setNotes("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <h1 style={{ color: "var(--primary-color)", marginBottom: "var(--spacing-xl)" }}>
            Schedule Appointment
          </h1>

          <form onSubmit={handleSubmit} style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-lg)"
          }}>
            <div style={{ position: "relative" }}>
              <FaUser style={{
                position: "absolute",
                left: "var(--spacing-md)",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)"
              }} />
              <Tooltip text="Select a patient for the appointment" ariaLabel="Select patient">
                <select
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  required
                  style={{
                    paddingLeft: "calc(var(--spacing-md) * 2 + 16px)",
                    width: "100%"
                  }}
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </Tooltip>
            </div>

            <div style={{ position: "relative" }}>
              <FaCalendarAlt style={{
                position: "absolute",
                left: "var(--spacing-md)",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)"
              }} />
              <Tooltip text="Choose a date after today" ariaLabel="Select date">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={today}
                  required
                  style={{
                    paddingLeft: "calc(var(--spacing-md) * 2 + 16px)",
                    width: "100%"
                  }}
                />
              </Tooltip>
            </div>

            <div style={{ position: "relative" }}>
              <FaClock style={{
                position: "absolute",
                left: "var(--spacing-md)",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)"
              }} />
              <Tooltip text="Set a time for the appointment" ariaLabel="Select time">
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                  style={{
                    paddingLeft: "calc(var(--spacing-md) * 2 + 16px)",
                    width: "100%"
                  }}
                />
              </Tooltip>
            </div>

            <div style={{ position: "relative" }}>
              <FaStickyNote style={{
                position: "absolute",
                left: "var(--spacing-md)",
                top: "var(--spacing-md)",
                color: "var(--text-secondary)"
              }} />
              <Tooltip text="Add any notes for the appointment (optional)" ariaLabel="Appointment notes">
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Notes (optional)"
                  rows={3}
                  style={{
                    paddingLeft: "calc(var(--spacing-md) * 2 + 16px)",
                    width: "100%",
                    resize: "vertical",
                    minHeight: "100px"
                  }}
                />
              </Tooltip>
            </div>

            {error && (
              <div className="card" style={{
                backgroundColor: "var(--error-color)",
                color: "white",
                padding: "var(--spacing-md)"
              }}>
                {error}
              </div>
            )}

            {success && (
              <div className="card" style={{
                backgroundColor: "var(--success-color)",
                color: "white",
                padding: "var(--spacing-md)"
              }}>
                {success}
              </div>
            )}

            <div style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "var(--spacing-md)"
            }}>
              <Tooltip text="Submit the appointment" ariaLabel="Set appointment">
                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{
                    padding: "var(--spacing-md) var(--spacing-xl)",
                    fontSize: "var(--font-size-lg)"
                  }}
                >
                  Schedule Appointment
                </button>
              </Tooltip>
            </div>
          </form>

          <Modal
            open={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title="Appointment Scheduled"
            ariaLabel="Appointment scheduled successfully"
            actions={
              <button
                className="btn btn-primary"
                onClick={() => setShowSuccessModal(false)}
                aria-label="Close"
              >
                Close
              </button>
            }
          >
            <div style={{
              textAlign: "center",
              padding: "var(--spacing-lg)",
              color: "var(--success-color)"
            }}>
              Appointment has been scheduled successfully!
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}