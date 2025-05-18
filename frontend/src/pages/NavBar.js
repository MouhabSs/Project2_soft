import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <Link to="/" className="navbar-home-icon" aria-label="Home">
            {/* Simple SVG Home Icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ea8de" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12L12 3l9 9"/>
              <path d="M9 21V9h6v12"/>
            </svg>
          </Link>
        </li>
        <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
        <li><Link to="/patients" className="navbar-link">Patients</Link></li>
        <li><Link to="/appointments" className="navbar-link">Appointments</Link></li>
        <li><Link to="/nutrition-plan" className="navbar-link">Nutrition Plan</Link></li>
        <li><Link to="/settings" className="navbar-link">Settings</Link></li>
      </ul>
    </nav>
  );
}