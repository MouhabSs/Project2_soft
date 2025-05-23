import React, { useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function AddPatient() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [physicalActivityLevel, setPhysicalActivityLevel] = useState("");
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Dietary and medical options
  const DIETARY_OPTIONS = [
    "Vegetarian", "Vegan", "Gluten-Free", "Lactose-Free", "Nut-Free",
    "Halal", "Kosher", "No restrictions"
  ];
  const MEDICAL_OPTIONS = [
    "Diabetes", "Hypertension", "High Cholesterol", "Obesity",
    "Celiac Disease", "Thyroid Disorder", "Kidney Disease", "Other"
  ];

  const handleDietaryChange = (option) => {
    setDietaryRestrictions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleMedicalChange = (option) => {
    setMedicalConditions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  // Add these validation functions
  const validateEmail = (email) => {
    if (!email) return true;
    // Only allow gmail or yahoo
    return /^[^\s@]+@(gmail\.com|yahoo\.com)$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{11}$/.test(phone);
  };

  const validateName = (name) => {
    // No numbers allowed
    return /^[A-Za-z\s]+$/.test(name);
  };

  const validateAge = (age) => {
    return /^\d+$/.test(age) && Number(age) > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    if (!name || !age || !gender) {
      setError("Name, age, and gender are required.");
      window.alert("Name, age, and gender are required.");
      return;
    }
    if (!validateName(name)) {
      setError("Name must not contain numbers.");
      window.alert("Name must not contain numbers.");
      return;
    }
    if (!validateAge(age)) {
      setError("Age must be a positive number.");
      window.alert("Age must be a positive number.");
      return;
    }
    if (email && !validateEmail(email)) {
      setError("Email must be a valid gmail.com or yahoo.com address.");
      window.alert("Email must be a valid gmail.com or yahoo.com address.");
      return;
    }
    if (phone && !validatePhone(phone)) {
      setError("Phone number must be exactly 11 digits.");
      window.alert("Phone number must be exactly 11 digits.");
      return;
    }

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age,
          gender,
          email,
          phone,
          dietaryRestrictions,
          physicalActivityLevel,
          medicalConditions,
          notes
        })
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to add patient");
      }
      setSubmitted(true);
      setTimeout(() => navigate("/patients"), 1000);
    } catch (err) {
      setError(err.message);
      window.alert(err.message);
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
          <select
            className="addpatient-input"
            value={gender}
            onChange={e => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            className="addpatient-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />
          <input
            className="addpatient-input"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone"
            type="tel"
          />

          <div style={{ margin: "1rem 0" }}>
            <label><strong>Dietary Restrictions:</strong></label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {DIETARY_OPTIONS.map(option => (
                <label key={option} style={{ minWidth: "120px" }}>
                  <input
                    type="checkbox"
                    checked={dietaryRestrictions.includes(option)}
                    onChange={() => handleDietaryChange(option)}
                  />{" "}
                  {option}
                </label>
              ))}
            </div>
          </div>

          <select
            className="addpatient-input"
            value={physicalActivityLevel}
            onChange={e => setPhysicalActivityLevel(e.target.value)}
          >
            <option value="">Physical Activity Level</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>

          <div style={{ margin: "1rem 0" }}>
            <label><strong>Medical Conditions:</strong></label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {MEDICAL_OPTIONS.map(option => (
                <label key={option} style={{ minWidth: "140px" }}>
                  <input
                    type="checkbox"
                    checked={medicalConditions.includes(option)}
                    onChange={() => handleMedicalChange(option)}
                  />{" "}
                  {option}
                </label>
              ))}
            </div>
          </div>

          <textarea
            className="addpatient-input"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes"
            rows={2}
          />
          <button className="addpatient-btn" type="submit">Add</button>
        </form>
        {submitted && <div className="addpatient-success">Patient "{name}" added!</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </>
  );
}