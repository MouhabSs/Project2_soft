import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Nutrition Clinic App</h1>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/patients">Patient List</Link></li>
          <li><Link to="/patients/add">Add Patient</Link></li>
        </ul>
      </nav>
    </div>
  );
}