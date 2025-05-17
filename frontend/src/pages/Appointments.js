import React from "react";
import NavBar from "./NavBar";

export default function Appointments() {
  return (
    <>
      <NavBar />
      <div className="dashboard-container">
      <h2>Appointments</h2>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Upcoming</h3>
          <ul>
            <li>May 10, 2025 - Alice Smith</li>
            <li>May 12, 2025 - Bob Johnson</li>
          </ul>
        </div>
        <div className="dashboard-card">
          <h3>Past</h3>
          <ul>
            <li>May 1, 2025 - Charlie Brown</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}