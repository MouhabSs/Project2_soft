import React, { useState } from "react";

export default function AddPatient() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you'd send this to the backend
  };

  return (
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
      {submitted && <div className="addpatient-success">Patient "{name}" added (dummy, not saved)!</div>}
    </div>
  );
}