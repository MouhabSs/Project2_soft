import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Modal from "../components/Modal";
import Tooltip from "../components/Tooltip";
import AppointmentList from "../components/AppointmentList";
import { FaCalendarAlt, FaClock, FaUser, FaStickyNote } from "react-icons/fa";
import "../styles/global.css";

// Working hours configuration
const WORKING_HOURS = {
  start: "09:00",
  end: "17:00",
  interval: 30 // minutes
};

export default function Appointments() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("schedule"); // "schedule" or "view"

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

  const generateTimeSlots = () => {
    const slots = [];
    const [startHour, startMinute] = WORKING_HOURS.start.split(":").map(Number);
    const [endHour, endMinute] = WORKING_HOURS.end.split(":").map(Number);
    
    let currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0);
    
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0);
    
    while (currentTime < endTime) {
      slots.push(currentTime.toTimeString().slice(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + WORKING_HOURS.interval);
    }
    
    return slots;
  };

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
          <div className="tabs" style={{ marginBottom: "var(--spacing-xl)" }}>
            <button
              className={`tab ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              Schedule Appointment
            </button>
            <button
              className={`tab ${activeTab === "view" ? "active" : ""}`}
              onClick={() => setActiveTab("view")}
            >
              View Appointments
            </button>
          </div>

          {activeTab === "schedule" ? (
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
                  <select
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    required
                    style={{
                      paddingLeft: "calc(var(--spacing-md) * 2 + 16px)",
                      width: "100%"
                    }}
                  >
                    <option value="">Select Time</option>
                    {generateTimeSlots().map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
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
          ) : (
            <div>
              <div className="tabs" style={{ marginBottom: "var(--spacing-lg)" }}>
                <button
                  className={`tab ${activeTab === "today" ? "active" : ""}`}
                  onClick={() => setActiveTab("today")}
                >
                  Today's Appointments
                </button>
                <button
                  className={`tab ${activeTab === "week" ? "active" : ""}`}
                  onClick={() => setActiveTab("week")}
                >
                  This Week
                </button>
              </div>
              <AppointmentList view={activeTab} />
            </div>
          )}

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