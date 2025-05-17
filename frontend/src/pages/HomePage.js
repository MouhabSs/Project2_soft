import React from "react";
import { Link } from "react-router-dom";

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
    <div className="home-container">
      <h1>Welcome to the Nutrition Clinic App</h1>
      <nav>
        <ul className="home-nav">
          <li><Link to="/dashboard" className="home-link">Dashboard</Link></li>
          <li><Link to="/patients" className="home-link">Patient List</Link></li>
          <li><Link to="/patients/add" className="home-link">Add Patient</Link></li>
          <li><Link to="/appointments" className="home-link">Appointments</Link></li>
          <li><Link to="/nutrition-plan" className="home-link">Nutrition Plan</Link></li>
          <li><Link to="/settings" className="home-link">Settings</Link></li>
        </ul>
      </nav>
      <div className="home-section">
        <h2>
          <Link to="/messages" className="home-section-link">Messages</Link>
        </h2>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
      <div className="home-section">
        <h2>
          <Link to="/reports" className="home-section-link">Reports</Link>
        </h2>
        <ul>
          {reports.map((rep, idx) => (
            <li key={idx}>{rep}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}