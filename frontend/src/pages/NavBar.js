import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
        <li><Link to="/patients" className="navbar-link">Patients</Link></li>
        <li><Link to="/appointments" className="navbar-link">Appointments</Link></li>
        <li><Link to="/nutrition-plan" className="navbar-link">Nutrition Plan</Link></li>
        <li><Link to="/settings" className="navbar-link">Settings</Link></li>
      </ul>
    </nav>
  );
}