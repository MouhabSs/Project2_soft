import React from "react";
import NavBar from "./NavBar";
import { FaCog } from "react-icons/fa";

export default function Settings() {
  return (
    <>
      <NavBar />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none"
      }}>
        <div className="card fade-in" style={{
          maxWidth: 480,
          width: "100%",
          padding: "2.5rem 2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
          borderRadius: 18,
          background: "#23272f",
          color: "#e0eafc",
          textAlign: "center"
        }}>
          <div style={{ marginBottom: 24 }}>
            <FaCog size={36} color="#4ea8de" style={{ marginBottom: 8 }} />
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e0eafc", margin: 0 }}>Settings</h1>
            <p style={{ color: "#b6c6e3", marginTop: 8, marginBottom: 0 }}>
              Manage your user account settings here.
            </p>
          </div>
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: "2rem 0 0 0",
            display: "grid",
            gap: 16
          }}>
            <li style={{ fontSize: 18 }}>Change password</li>
            <li style={{ fontSize: 18 }}>Update email</li>
            <li style={{ fontSize: 18 }}>Notification preferences</li>
          </ul>
        </div>
      </div>
    </>
  );
}