import React, { useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function AddPatient() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add patient");
      }
      setSubmitted(true);
      setTimeout(() => navigate("/patients"), 1000); // Redirect after 1s
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="addpatient-container">
        <h2>Add Patient</h2>
        <form className="addpatient-form" onSubmit={handleSubmit}>
          <input
            className="addpatient-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            className="addpatient-input"
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="Age"
            type="number"
            required
          />
          <button className="addpatient-btn" type="submit">Add</button>
        </form>
        {submitted && <div className="addpatient-success">Patient "{name}" added!</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </>
  );
}