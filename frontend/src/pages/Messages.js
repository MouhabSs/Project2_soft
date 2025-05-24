import React from "react";
import NavBar from "./NavBar";
import { FaEnvelopeOpenText } from "react-icons/fa";

export default function Messages() {
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
            <FaEnvelopeOpenText size={36} color="#4ea8de" style={{ marginBottom: 8 }} />
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e0eafc", margin: 0 }}>Messages</h1>
            <p style={{ color: "#b6c6e3", marginTop: 8, marginBottom: 0 }}>
              This is your notifications/messages center.
            </p>
          </div>
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: "2rem 0 0 0",
            display: "grid",
            gap: 16
          }}>
            <li style={{ fontSize: 18 }}>New appointment scheduled for Alice Smith.</li>
            <li style={{ fontSize: 18 }}>Bob Johnson updated his nutrition plan.</li>
          </ul>
        </div>
      </div>
    </>
  );
}