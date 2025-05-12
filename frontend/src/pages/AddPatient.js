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
    <div>
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="Age"
          type="number"
          required
        />
        <button type="submit">Add</button>
      </form>
      {submitted && <div>Patient "{name}" added (dummy, not saved)!</div>}
    </div>
  );
}