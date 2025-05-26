import React, { useState } from "react";
import NavBar from "./NavBar";

export default function EditPatient() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submit logic
    alert("Patient updated (dummy, not saved)!");
  };

  return (
    <>
      <NavBar />
      <div className="addpatient-container">
        <h2>Edit Patient</h2>
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
          <textarea
            className="addpatient-input"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes"
            rows={3}
          />
          <button className="addpatient-btn" type="submit">Update</button>
        </form>
      </div>
    </>
  );
}