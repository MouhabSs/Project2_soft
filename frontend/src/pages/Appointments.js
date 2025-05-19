import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";

export default function Appointments() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    if (!patientId || !date) {
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
        body: JSON.stringify({ patientId, date, time }),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.message || result.error || "Failed to set appointment");
      }
      setSuccess("Appointment set successfully!");
      setPatientId("");
      setDate("");
      setTime("");
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
          <input
            className="appointments-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            min={today}
            required
          />
          <input
            className="appointments-input"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            placeholder="Time"
          />
          <button className="appointments-btn" type="submit">Set Appointment</button>
        </form>
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: "1rem" }}>{success}</div>}
      </div>
    </>
  );
}