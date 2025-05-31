import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUserInjured, FaCalendarAlt, FaAppleAlt, FaCog, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "../styles/global.css";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        className="btn"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-sm)",
          color: "var(--text-primary)"
        }}
        onClick={() => setOpen(o => !o)}
        aria-label="User menu"
      >
        <FaUserCircle size={32} color="var(--primary-color)" />
        <span style={{ color: "var(--text-primary)" }}>User</span>
      </button>
      {open && (
        <div className="card fade-in" style={{
          position: "absolute",
          right: 0,
          top: "100%",
          marginTop: "var(--spacing-sm)",
          minWidth: "200px",
          zIndex: 1000,
          background: "#23272f",
          color: "#e0eafc",
          boxShadow: "var(--shadow-lg)",
          borderRadius: "var(--radius-lg)"
        }}>
          <div style={{
            padding: "var(--spacing-md)",
            borderBottom: "1px solid #414345",
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)"
          }}>
            <FaUserCircle size={24} color="var(--primary-color)" />
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>User Profile</span>
          </div>
          <Link
            to="/settings"
            className="btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
              width: "100%",
              justifyContent: "flex-start",
              background: "none",
              color: "var(--text-primary)"
            }}
            onClick={() => setOpen(false)}
          >
            <FaCog /> Settings
          </Link>
          <button
            className="btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
              width: "100%",
              justifyContent: "flex-start",
              background: "none",
              color: "var(--error-color)"
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function NavBar() {
  return (
    <nav style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      minHeight: "100vh",
      width: "220px",
      background: "#23272f",
      color: "#e0eafc",
      boxShadow: "2px 0 16px 0 rgb(0 0 0 / 0.18)",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 200,
      padding: "var(--spacing-xl) var(--spacing-md)"
    }}>
      <div style={{ marginBottom: "var(--spacing-xl)", textAlign: "center" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12L12 3l9 9"/>
            <path d="M9 21V9h6v12"/>
          </svg>
          <span style={{ color: "#e0eafc", fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>NutriClinic</span>
        </Link>
      </div>
      <ul style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-lg)",
        margin: 0,
        padding: 0,
        listStyle: "none"
      }}>
        <li>
          <Link to="/dashboard" className="btn" style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            background: "none",
            color: "#e0eafc",
            fontWeight: 500,
            fontSize: 16
          }}>
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/patients" className="btn" style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            background: "none",
            color: "#e0eafc",
            fontWeight: 500,
            fontSize: 16
          }}>
            <FaUserInjured /> Patients
          </Link>
        </li>
        <li>
          <Link to="/appointments" className="btn" style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            background: "none",
            color: "#e0eafc",
            fontWeight: 500,
            fontSize: 16
          }}>
            <FaCalendarAlt /> Appointments
          </Link>
        </li>
        <li>
          <Link to="/nutrition-plan" className="btn" style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            background: "none",
            color: "#e0eafc",
            fontWeight: 500,
            fontSize: 16
          }}>
            <FaAppleAlt /> Nutrition Plan
          </Link>
        </li>
        <li>
          <Link to="/send-medication-request" className="btn" style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            background: "none",
            color: "#e0eafc",
            fontWeight: 500,
            fontSize: 16
          }}>
            Send Med Request
          </Link>
        </li>
      </ul>
      <div style={{ marginTop: "auto", textAlign: "center" }}>
        <ProfileMenu />
      </div>
    </nav>
  );
}