import React, { useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaNotesMedical, FaAppleAlt, FaHeartbeat } from "react-icons/fa";
import "../styles/global.css";

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
  const [validationErrors, setValidationErrors] = useState({});
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

  const validateForm = () => {
    const errors = {};
    
    if (!name) {
      errors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      errors.name = "Name must not contain numbers";
    }

    if (!age) {
      errors.age = "Age is required";
    } else if (!/^\d+$/.test(age) || Number(age) <= 0) {
      errors.age = "Age must be a positive number";
    }

    if (!gender) {
      errors.gender = "Gender is required";
    }

    if (email && !/^[^\s@]+@(gmail\.com|yahoo\.com)$/.test(email)) {
      errors.email = "Email must be a valid gmail.com or yahoo.com address";
    }

    if (phone && !/^\d{11}$/.test(phone)) {
      errors.phone = "Phone number must be exactly 11 digits";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    if (!validateForm()) {
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
      setTimeout(() => navigate("/patients"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <h1 style={{ color: "var(--primary-color)", marginBottom: "var(--spacing-xl)" }}>
            Add New Patient
          </h1>

          <form onSubmit={handleSubmit} style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-lg)"
          }}>
            {/* Basic Information Section */}
            <div className="form-section">
              <h2 style={{ fontSize: "1.2rem", color: "#e0eafc", marginBottom: "var(--spacing-md)" }}>
                <FaUser style={{ marginRight: "var(--spacing-sm)" }} /> Basic Information
              </h2>
              <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
                <div>
                  <input
                    className={`form-input ${validationErrors.name ? 'error' : ''}`}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                  {validationErrors.name && (
                    <div className="error-message">{validationErrors.name}</div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                  <div>
                    <input
                      className={`form-input ${validationErrors.age ? 'error' : ''}`}
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      placeholder="Age"
                      type="number"
                      min="0"
                      required
                    />
                    {validationErrors.age && (
                      <div className="error-message">{validationErrors.age}</div>
                    )}
                  </div>

                  <div>
                    <select
                      className={`form-input ${validationErrors.gender ? 'error' : ''}`}
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {validationErrors.gender && (
                      <div className="error-message">{validationErrors.gender}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="form-section">
              <h2 style={{ fontSize: "1.2rem", color: "#e0eafc", marginBottom: "var(--spacing-md)" }}>
                <FaEnvelope style={{ marginRight: "var(--spacing-sm)" }} /> Contact Information
              </h2>
              <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
                <div>
                  <input
                    className={`form-input ${validationErrors.email ? 'error' : ''}`}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email (gmail.com or yahoo.com)"
                    type="email"
                  />
                  {validationErrors.email && (
                    <div className="error-message">{validationErrors.email}</div>
                  )}
                </div>

                <div>
                  <input
                    className={`form-input ${validationErrors.phone ? 'error' : ''}`}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Phone Number (11 digits)"
                    type="tel"
                  />
                  {validationErrors.phone && (
                    <div className="error-message">{validationErrors.phone}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Health Information Section */}
            <div className="form-section">
              <h2 style={{ fontSize: "1.2rem", color: "#e0eafc", marginBottom: "var(--spacing-md)" }}>
                <FaAppleAlt style={{ marginRight: "var(--spacing-sm)" }} /> Dietary Information
              </h2>
              <div style={{ marginBottom: "var(--spacing-md)" }}>
                <select
                  className="form-input"
                  value={physicalActivityLevel}
                  onChange={e => setPhysicalActivityLevel(e.target.value)}
                >
                  <option value="">Physical Activity Level</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div style={{ marginBottom: "var(--spacing-md)" }}>
                <label style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "#e0eafc" }}>
                  Dietary Restrictions:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "var(--spacing-sm)" }}>
                  {DIETARY_OPTIONS.map(option => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={dietaryRestrictions.includes(option)}
                        onChange={() => handleDietaryChange(option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Medical Information Section */}
            <div className="form-section">
              <h2 style={{ fontSize: "1.2rem", color: "#e0eafc", marginBottom: "var(--spacing-md)" }}>
                <FaHeartbeat style={{ marginRight: "var(--spacing-sm)" }} /> Medical Information
              </h2>
              <div style={{ marginBottom: "var(--spacing-md)" }}>
                <label style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "#e0eafc" }}>
                  Medical Conditions:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "var(--spacing-sm)" }}>
                  {MEDICAL_OPTIONS.map(option => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={medicalConditions.includes(option)}
                        onChange={() => handleMedicalChange(option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className="form-section">
              <h2 style={{ fontSize: "1.2rem", color: "#e0eafc", marginBottom: "var(--spacing-md)" }}>
                <FaNotesMedical style={{ marginRight: "var(--spacing-sm)" }} /> Additional Notes
              </h2>
              <textarea
                className="form-input"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional notes or comments"
                rows={4}
              />
            </div>

            <button className="btn btn-primary" type="submit" style={{ marginTop: "var(--spacing-lg)" }}>
              Add Patient
            </button>

            {submitted && (
              <div className="success-message">
                Patient "{name}" added successfully! Redirecting...
              </div>
            )}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}