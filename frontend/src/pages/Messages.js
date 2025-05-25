import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { FaEnvelopeOpenText, FaSpinner } from "react-icons/fa";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch messages");
        }

        setMessages(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

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

          {loading ? (
            <div style={{ textAlign: "center" }}>
              <FaSpinner style={{
                fontSize: "2rem",
                color: "var(--primary-color)",
                animation: "spin 1s linear infinite"
              }} />
            </div>
          ) : error ? (
            <div style={{ color: "var(--error-color)", textAlign: "center" }}>
              Error: {error}
            </div>
          ) : messages.length === 0 ? (
            <div style={{ color: "var(--text-secondary)", textAlign: "center" }}>
              No messages found.
            </div>
          ) : (
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: "2rem 0 0 0",
              display: "grid",
              gap: 16,
              textAlign: "left"
            }}>
              {messages.map(message => (
                <li key={message._id} style={{ fontSize: 18, color: "var(--text-primary)" }}>
                  {message.content}
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
       <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}