import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { FaUser, FaLock, FaLeaf } from "react-icons/fa";
import "../styles/global.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (login(username, password)) {
      navigate("/");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--background-color)",
      padding: "var(--spacing-md)"
    }}>
      <div className="card fade-in" style={{
        width: "100%",
        maxWidth: "400px",
        padding: "var(--spacing-2xl) var(--spacing-xl)",
        boxShadow: "var(--shadow-lg)",
        borderRadius: "var(--radius-xl)",
        background: "#23272f",
        color: "#e0eafc"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "var(--spacing-xl)"
        }}>
          <FaLeaf size={48} color="#4ea8de" style={{ marginBottom: 8 }} />
          <h1 style={{
            color: "#e0eafc",
            marginBottom: "var(--spacing-sm)",
            fontWeight: 700
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: "#b6c6e3"
          }}>
            Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-md)"
        }}>
          <div style={{ position: "relative" }}>
            <FaUser style={{
              position: "absolute",
              left: "var(--spacing-md)",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#4ea8de"
            }} />
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              style={{
                paddingLeft: "calc(var(--spacing-md) * 2 + 16px)",
                width: "100%",
                background: "#23272f",
                color: "#e0eafc",
                border: "1px solid #4ea8de"
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  passwordRef.current && passwordRef.current.focus();
                }
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <FaLock style={{
              position: "absolute",
              left: "var(--spacing-md)",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#4ea8de"
            }} />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              ref={passwordRef}
              style={{
                paddingLeft: "calc(var(--spacing-md) * 2 + 16px)",
                width: "100%",
                background: "#23272f",
                color: "#e0eafc",
                border: "1px solid #4ea8de"
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
            />
          </div>

          {error && (
            <div style={{
              color: "#ef4444",
              background: "rgba(239,68,68,0.08)",
              borderRadius: "var(--radius-md)",
              padding: "var(--spacing-sm)",
              marginBottom: "var(--spacing-sm)",
              textAlign: "center"
            }}>{error}</div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            style={{
              marginTop: "var(--spacing-md)",
              width: "100%",
              fontWeight: 600,
              fontSize: "var(--font-size-lg)",
              letterSpacing: 1
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;