import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaNotesMedical, FaAppleAlt, FaHeartbeat, FaCheck, FaTimes } from "react-icons/fa";
import { patientApi } from "../services/api";
import { toast } from "react-toastify";
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
  const [fieldValidation, setFieldValidation] = useState({
    name: { isValid: false, message: '' },
    age: { isValid: false, message: '' },
    gender: { isValid: false, message: '' },
    email: { isValid: true, message: '' },
    phone: { isValid: true, message: '' }
  });
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

  // Real-time validation
  useEffect(() => {
    validateField('name', name);
    validateField('age', age);
    validateField('gender', gender);
    if (email) validateField('email', email);
    if (phone) validateField('phone', phone);
  }, [name, age, gender, email, phone]);

  const validateField = (field, value) => {
    let isValid = true;
    let message = '';

    switch (field) {
      case 'name':
        if (!value) {
          isValid = false;
          message = 'Name is required';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          isValid = false;
          message = 'Name must not contain numbers';
        }
        break;
      case 'age':
        if (!value) {
          isValid = false;
          message = 'Age is required';
        } else if (!/^\d+$/.test(value) || Number(value) <= 0) {
          isValid = false;
          message = 'Age must be a positive number';
        }
        break;
      case 'gender':
        if (!value) {
          isValid = false;
          message = 'Gender is required';
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@(gmail\.com|yahoo\.com)$/.test(value)) {
          isValid = false;
          message = 'Email must be a valid gmail.com or yahoo.com address';
        }
        break;
      case 'phone':
        if (value && !/^\d{11}$/.test(value)) {
          isValid = false;
          message = 'Phone number must be exactly 11 digits';
        }
        break;
      default:
        break;
    }

    setFieldValidation(prev => ({
      ...prev,
      [field]: { isValid, message }
    }));

    return isValid;
  };

  const validateForm = () => {
    const isNameValid = validateField('name', name);
    const isAgeValid = validateField('age', age);
    const isGenderValid = validateField('gender', gender);
    const isEmailValid = email ? validateField('email', email) : true;
    const isPhoneValid = phone ? validateField('phone', phone) : true;

    return isNameValid && isAgeValid && isGenderValid && isEmailValid && isPhoneValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const response = await patientApi.create({
        name,
        age,
        gender,
        email,
        phone,
        dietaryRestrictions,
        physicalActivityLevel,
        medicalConditions,
        notes
      });

      if (response.data) {
        setSubmitted(true);
        toast.success("Patient added successfully!");
        setTimeout(() => navigate("/patients"), 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to add patient. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
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
                  <div style={{ position: 'relative' }}>
                    <input
                      className={`form-input ${!fieldValidation.name.isValid ? 'error' : fieldValidation.name.isValid ? 'success' : ''}`}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                    />
                    {name && (
                      <span style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: fieldValidation.name.isValid ? '#4caf50' : '#f44336'
                      }}>
                        {fieldValidation.name.isValid ? <FaCheck /> : <FaTimes />}
                      </span>
                    )}
                  </div>
                  {!fieldValidation.name.isValid && fieldValidation.name.message && (
                    <div className="error-message">{fieldValidation.name.message}</div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                  <div>
                    <div style={{ position: 'relative' }}>
                      <input
                        className={`form-input ${!fieldValidation.age.isValid ? 'error' : fieldValidation.age.isValid ? 'success' : ''}`}
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        placeholder="Age"
                        type="number"
                        min="0"
                        required
                      />
                      {age && (
                        <span style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: fieldValidation.age.isValid ? '#4caf50' : '#f44336'
                        }}>
                          {fieldValidation.age.isValid ? <FaCheck /> : <FaTimes />}
                        </span>
                      )}
                    </div>
                    {!fieldValidation.age.isValid && fieldValidation.age.message && (
                      <div className="error-message">{fieldValidation.age.message}</div>
                    )}
                  </div>

                  <div>
                    <div style={{ position: 'relative' }}>
                      <select
                        className={`form-input ${!fieldValidation.gender.isValid ? 'error' : fieldValidation.gender.isValid ? 'success' : ''}`}
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {gender && (
                        <span style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: fieldValidation.gender.isValid ? '#4caf50' : '#f44336'
                        }}>
                          {fieldValidation.gender.isValid ? <FaCheck /> : <FaTimes />}
                        </span>
                      )}
                    </div>
                    {!fieldValidation.gender.isValid && fieldValidation.gender.message && (
                      <div className="error-message">{fieldValidation.gender.message}</div>
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
                  <div style={{ position: 'relative' }}>
                    <input
                      className={`form-input ${!fieldValidation.email.isValid ? 'error' : fieldValidation.email.isValid ? 'success' : ''}`}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Email (gmail.com or yahoo.com)"
                      type="email"
                    />
                    {email && (
                      <span style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: fieldValidation.email.isValid ? '#4caf50' : '#f44336'
                      }}>
                        {fieldValidation.email.isValid ? <FaCheck /> : <FaTimes />}
                      </span>
                    )}
                  </div>
                  {!fieldValidation.email.isValid && fieldValidation.email.message && (
                    <div className="error-message">{fieldValidation.email.message}</div>
                  )}
                </div>

                <div>
                  <div style={{ position: 'relative' }}>
                    <input
                      className={`form-input ${!fieldValidation.phone.isValid ? 'error' : fieldValidation.phone.isValid ? 'success' : ''}`}
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Phone Number (11 digits)"
                      type="tel"
                    />
                    {phone && (
                      <span style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: fieldValidation.phone.isValid ? '#4caf50' : '#f44336'
                      }}>
                        {fieldValidation.phone.isValid ? <FaCheck /> : <FaTimes />}
                      </span>
                    )}
                  </div>
                  {!fieldValidation.phone.isValid && fieldValidation.phone.message && (
                    <div className="error-message">{fieldValidation.phone.message}</div>
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

      <style>
        {`
          .form-input {
            width: 100%;
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            background: #23272f;
            color: #e0eafc;
            border: 1px solid #414345;
            font-size: var(--font-size-base);
            transition: all 0.3s ease;
          }

          .form-input:focus {
            outline: none;
            border-color: #4ea8de;
            box-shadow: 0 0 0 2px rgba(78, 168, 222, 0.2);
          }

          .form-input.error {
            border-color: #f44336;
          }

          .form-input.success {
            border-color: #4caf50;
          }

          .error-message {
            color: #f44336;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
        `}
      </style>
    </>
  );
}