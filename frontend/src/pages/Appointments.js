import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Modal from "../components/Modal";
import Tooltip from "../components/Tooltip";

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
      <div className="appointments-container">
        <h2>Set Appointment</h2>
        <form className="appointments-form" onSubmit={handleSubmit}>
          <Tooltip text="Select a patient for the appointment" ariaLabel="Select patient">
            <select
              className="appointments-input"
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} ({patient._id})
                </option>
              ))}
            </select>
          </Tooltip>
          <Tooltip text="Choose a date after today" ariaLabel="Select date">
            <input
              className="appointments-input"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={today}
              required
            />
          </Tooltip>
          <Tooltip text="Set a time for the appointment" ariaLabel="Select time">
            <input
              className="appointments-input"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              placeholder="Time"
              required
            />
          </Tooltip>
          <Tooltip text="Add any notes for the appointment (optional)" ariaLabel="Appointment notes">
            <textarea
              className="appointments-input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={3}
              style={{resize: "vertical", minHeight: 60, marginBottom: 16}}
            />
          </Tooltip>
          <div style={{display: "flex", justifyContent: "center", marginTop: 24}}>
            <Tooltip text="Submit the appointment" ariaLabel="Set appointment">
              <button className="appointments-btn" type="submit" style={{fontSize: "1.25rem", padding: "0.9rem 2.5rem", borderRadius: 8, fontWeight: 600}}>Set Appointment</button>
            </Tooltip>
          </div>
          <Modal
            open={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title="Appointment Set"
            ariaLabel="Appointment set successfully"
            actions={<button className="modal-cancel-btn" onClick={() => setShowSuccessModal(false)} aria-label="Close">Close</button>}
          >
            <div>Appointment set successfully!</div>
          </Modal>
        </form>
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: "1rem" }}>{success}</div>}
      </div>
    </>
  );
}