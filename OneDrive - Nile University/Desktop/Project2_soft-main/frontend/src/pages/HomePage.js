import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

export default function HomePage() {
  // Dummy data for messages and reports
  const messages = [
    "New appointment scheduled for Alice Smith.",
    "Bob Johnson updated his nutrition plan."
  ];
  const reports = [
    "Monthly patient summary available.",
    "Appointment statistics updated."
  ];

  return (
    <div className="container">
      <div className="card" style={{ marginTop: "var(--spacing-xl)" }}>
        <h1 style={{ color: "var(--primary-color)" }}>Welcome to the Nutrition Clinic App</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-xl)" }}>
          Your comprehensive platform for managing patient nutrition and health
        </p>
        
        <div className="grid grid-cols-2" style={{ gap: "var(--spacing-xl)" }}>
          <div className="card">
            <h2>Quick Actions</h2>
            <nav>
              <ul style={{ display: "grid", gap: "var(--spacing-md)" }}>
                <li>
                  <Link to="/dashboard" className="btn btn-primary" style={{ width: "100%" }}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/patients" className="btn btn-primary" style={{ width: "100%" }}>
                    Patient List
                  </Link>
                </li>
                <li>
                  <Link to="/patients/add" className="btn btn-primary" style={{ width: "100%" }}>
                    Add Patient
                  </Link>
                </li>
                <li>
                  <Link to="/appointments" className="btn btn-primary" style={{ width: "100%" }}>
                    Appointments
                  </Link>
                </li>
                <li>
                  <Link to="/nutrition-plan" className="btn btn-primary" style={{ width: "100%" }}>
                    Nutrition Plan
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="btn btn-primary" style={{ width: "100%" }}>
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
            <div className="card">
              <h2 style={{ color: "var(--primary-color)" }}>
                <Link to="/messages" style={{ textDecoration: "none" }}>Recent Messages</Link>
              </h2>
              <ul style={{ display: "grid", gap: "var(--spacing-md)" }}>
                {messages.map((msg, idx) => (
                  <li key={idx} style={{ 
                    padding: "var(--spacing-md)",
                    backgroundColor: "var(--background-color)",
                    borderRadius: "var(--radius-md)"
                  }}>
                    {msg}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2 style={{ color: "var(--primary-color)" }}>
                <Link to="/reports" style={{ textDecoration: "none" }}>Latest Reports</Link>
              </h2>
              <ul style={{ display: "grid", gap: "var(--spacing-md)" }}>
                {reports.map((rep, idx) => (
                  <li key={idx} style={{ 
                    padding: "var(--spacing-md)",
                    backgroundColor: "var(--background-color)",
                    borderRadius: "var(--radius-md)"
                  }}>
                    {rep}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}