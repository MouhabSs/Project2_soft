import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          className="login-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              passwordRef.current && passwordRef.current.focus();
            }
          }}
        />
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          ref={passwordRef}
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;