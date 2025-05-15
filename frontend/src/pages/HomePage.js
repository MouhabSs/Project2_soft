import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to the Nutrition Clinic App</h1>
      <nav>
        <ul className="home-nav">
          <li><Link to="/dashboard" className="home-link">Dashboard</Link></li>
          <li><Link to="/patients" className="home-link">Patient List</Link></li>
          <li><Link to="/patients/add" className="home-link">Add Patient</Link></li>
        </ul>
      </nav>
    </div>
  );
}