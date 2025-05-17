import React from "react";
import NavBar from "./NavBar";

export default function Reports() {
  return (
    <>
      <NavBar />
      <div className="dashboard-container">
      <h2>Reports</h2>
      <div className="dashboard-card">
        <p>Generate or view reports related to patients here.</p>
        <ul>
          <li>Monthly patient summary</li>
          <li>Appointment statistics</li>
          <li>Nutrition plan adherence</li>
        </ul>
      </div>
    </div>
    </>
  );
}