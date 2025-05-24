import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { FaAppleAlt, FaBreadSlice, FaDrumstickBite, FaFish, FaUser, FaSave, FaHistory, FaSpinner } from "react-icons/fa";

export default function NutritionPlan() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [nutritionPlan, setNutritionPlan] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" }); // { message: '...', type: 'success' | 'error' }
  const [planHistory, setPlanHistory] = useState([]); // Placeholder for history

  // Fetch patients on component mount
  useEffect(() => {
    fetch("/api/patients")
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setPatients(result.data);
        } else {
          setFeedback({ message: result.message || "Failed to fetch patients", type: "error" });
        }
        setLoadingPatients(false);
      })
      .catch(err => {
        setFeedback({ message: err.message || "Failed to fetch patients", type: "error" });
        setLoadingPatients(false);
      });
  }, []);

  // Fetch nutrition plan when patient is selected
  useEffect(() => {
    if (selectedPatientId) {
      setLoadingPlan(true);
      setFeedback({ message: "", type: "" });
      // Replace with actual API call to fetch patient's nutrition plan
      fetch(`/api/nutritionplan/${selectedPatientId}`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            setNutritionPlan(result.data);
          } else {
             // If no plan exists, initialize with empty fields
            setNutritionPlan({
              breakfast: "",
              lunch: "",
              dinner: "",
            });
            // Optionally set feedback if no plan found explicitly
            // setFeedback({ message: "No nutrition plan found for this patient. You can create one.", type: "info" });
          }
          setLoadingPlan(false);
        })
        .catch(err => {
          setFeedback({ message: err.message || "Failed to fetch nutrition plan", type: "error" });
          setLoadingPlan(false);
        });
         // Placeholder: Fetch plan history
         fetch(`/api/nutritionplan/${selectedPatientId}/history`)
         .then(res => res.json())
         .then(result => {
           if (result.success && result.data) {
             setPlanHistory(result.data);
           } else {
             setPlanHistory([]);
           }
         })
         .catch(err => console.error("Failed to fetch plan history:", err)); // Log error, don't show to user for history

    } else {
      // Reset plan and history when no patient is selected
      setNutritionPlan({
        breakfast: "",
        lunch: "",
        dinner: "",
      });
      setPlanHistory([]);
    }
  }, [selectedPatientId]);

  const handlePlanChange = (meal, value) => {
    setNutritionPlan(prevPlan => ({ ...prevPlan, [meal]: value }));
  };

  const handleSavePlan = () => {
    if (!selectedPatientId) {
      setFeedback({ message: "Please select a patient first.", type: "error" });
      return;
    }

    setSavingPlan(true);
    setFeedback({ message: "", type: "" });

    // Replace with actual API call to save/update the nutrition plan
    fetch(`/api/nutritionplan/${selectedPatientId}`, {
      method: "POST", // or PUT if updating existing
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nutritionPlan),
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setFeedback({ message: "Nutrition plan saved successfully!", type: "success" });
          // Re-fetch history after saving
          fetch(`/api/nutritionplan/${selectedPatientId}/history`)
            .then(res => res.json())
            .then(historyResult => {
              if (historyResult.success && historyResult.data) {
                setPlanHistory(historyResult.data);
              } else {
                 setPlanHistory([]);
              }
            })
            .catch(err => console.error("Failed to re-fetch history:", err));

        } else {
          setFeedback({ message: result.message || "Failed to save nutrition plan", type: "error" });
        }
        setSavingPlan(false);
      })
      .catch(err => {
        setFeedback({ message: err.message || "Failed to save nutrition plan", type: "error" });
        setSavingPlan(false);
      });
  };

  return (
    <>
      <NavBar />
      <div style={{
        minHeight: "calc(100vh - 64px)", // Adjust for fixed navbar height
        display: "flex",
        alignItems: "flex-start", // Align to top
        justifyContent: "center",
        padding: "var(--spacing-xl)", // Add padding
        background: "none"
      }}>
        <div className="card fade-in" style={{
          maxWidth: 600, // Increase max width slightly
          width: "100%",
          padding: "2.5rem 2rem",
          boxShadow: "var(--shadow-lg)",
          borderRadius: "var(--radius-xl)",
          background: "#23272f",
          color: "#e0eafc",
        }}>
          <div style={{ marginBottom: "var(--spacing-lg)", textAlign: "center" }}>
            <FaAppleAlt size={40} color="#4ea8de" style={{ marginBottom: "var(--spacing-sm)" }} />
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e0eafc", margin: 0 }}>Nutrition Plan</h1>
            <p style={{ color: "#b6c6e3", marginTop: "var(--spacing-sm)", marginBottom: 0 }}>
              Assign or view a nutrition plan for the selected patient.
            </p>
          </div>

          <div style={{ marginBottom: "var(--spacing-xl)" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#e0eafc", marginBottom: "var(--spacing-md)" }}>
              <FaUser style={{ marginRight: "var(--spacing-sm)" }} /> Select Patient
            </h2>
            {loadingPatients ? (
              <div style={{ textAlign: "center" }}>Loading Patients...</div>
            ) : feedback.type === "error" && feedback.message.includes("fetch patients") ? (
                 <div style={{ color: "#ef4444", textAlign: "center" }}>{feedback.message}</div>
            ) : (
              <div style={{ position: "relative" }}>
                 <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    background: "#23272f",
                    color: "#e0eafc",
                    border: "1px solid #4ea8de",
                    fontSize: "var(--font-size-base)",
                    appearance: "none", // Hide default arrow
                    paddingRight: "calc(var(--spacing-md) * 2 + 16px)", // Make space for custom arrow
                  }}
                  disabled={savingPlan}
                >
                  <option value="">-- Select a Patient --</option>
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
                 {/* Custom dropdown arrow */}
                <div style={{
                  position: "absolute",
                  right: "var(--spacing-md)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#4ea8de"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {selectedPatientId && (
            <div className="fade-in">
              <h2 style={{ fontSize: "1.5rem", color: "#e0eafc", marginBottom: "var(--spacing-md)" }}>
                Current Nutrition Plan
              </h2>
              {loadingPlan ? (
                <div style={{ textAlign: "center" }}>Loading Plan...</div>
              ) : feedback.type === "error" && feedback.message.includes("fetch nutrition plan") ? (
                 <div style={{ color: "#ef4444", textAlign: "center" }}>{feedback.message}</div>
              ) : (
                <div style={{ display: "grid", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
                  <div style={{ textAlign: "left"}}>
                    <h3 style={{ fontSize: "1.1rem", color: "#e0eafc", marginBottom: "var(--spacing-sm)" }}>
                      <FaBreadSlice color="#ffd580" style={{ marginRight: "var(--spacing-sm)" }} /> Breakfast:
                    </h3>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <button type="button" style={{ fontSize: "0.9em", padding: "2px 8px", borderRadius: 6, border: "1px solid #4ea8de", background: "#23272f", color: "#4ea8de", cursor: "pointer" }} onClick={() => handlePlanChange("breakfast", "Oatmeal with fruit and nuts")}>Oatmeal</button>
                      <button type="button" style={{ fontSize: "0.9em", padding: "2px 8px", borderRadius: 6, border: "1px solid #4ea8de", background: "#23272f", color: "#4ea8de", cursor: "pointer" }} onClick={() => handlePlanChange("breakfast", "Greek yogurt with berries")}>Yogurt</button>
                      <button type="button" style={{ fontSize: "0.9em", padding: "2px 8px", borderRadius: 6, border: "1px solid #4ea8de", background: "#23272f", color: "#4ea8de", cursor: "pointer" }} onClick={() => handlePlanChange("breakfast", "Eggs and whole grain toast")}>Eggs & Toast</button>
                    </div>
                     <textarea
                      value={nutritionPlan.breakfast}
                      onChange={e => handlePlanChange("breakfast", e.target.value)}
                      rows={3}
                      placeholder="E.g. Oatmeal with fruit, Greek yogurt, eggs & toast..."
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        background: "#23272f",
                        color: "#e0eafc",
                        border: "1px solid #414345",
                        resize: "vertical",
                        fontSize: "var(--font-size-base)"
                      }}
                      disabled={savingPlan}
                    />
                  </div>
                  <div style={{ textAlign: "left"}}>
                     <h3 style={{ fontSize: "1.1rem", color: "#e0eafc", marginBottom: "var(--spacing-sm)" }}>
                       <FaDrumstickBite color="#fbbf24" style={{ marginRight: "var(--spacing-sm)" }} /> Lunch:
                     </h3>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <button type="button" style={{ fontSize: "0.9em", padding: "2px 8px", borderRadius: 6, border: "1px solid #4ea8de", background: "#23272f", color: "#4ea8de", cursor: "pointer" }} onClick={() => handlePlanChange("lunch", "Grilled chicken salad")}>Chicken Salad</button>
                      <button type="button" style={{ fontSize: "0.9em", padding: "2px 8px", borderRadius: 6, border: "1px solid #4ea8de", background: "#23272f", color: "#4ea8de", cursor: "pointer" }} onClick={() => handlePlanChange("lunch", "Quinoa bowl with veggies")}>Quinoa Bowl</button>
                      <button type="button" style={{ fontSize: "0.9em", padding: "2px 8px", borderRadius: 6, border: "1px solid #4ea8de", background: "#23272f", color: "#4ea8de", cursor: "pointer" }} onClick={() => handlePlanChange("lunch", "Turkey sandwich on whole grain bread")}>Turkey Sandwich</button>
                    </div>
                    <textarea
                      value={nutritionPlan.lunch}
                      onChange={e => handlePlanChange("lunch", e.target.value)}
                      rows={3}
                      placeholder="E.g. Chicken salad, quinoa bowl, turkey sandwich..."
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        background: "#23272f",
                        color: "#e0eafc",
                        border: "1px solid #414345",
                        resize: "vertical",
                        fontSize: "var(--font-size-base)"
                      }}
                      disabled={savingPlan}
                    />
                  </div>
                  <div style={{ textAlign: "left"}}>
                    <h3 style={{ fontSize: "1.1rem", color: "#e0eafc", marginBottom: "var(--spacing-sm)" }}>
                       <FaFish color="#60a5fa" style={{ marginRight: "var(--spacing-sm)" }} /> Dinner:
                     </h3>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <button type="button" style={{ fontSize: "0.9em", padding: "2px 8px", borderRadius: 6, border: "1px solid #4ea8de", background: "#23272f", color: "#4ea8de", cursor: "pointer" }} onClick={() => handlePlanChange("dinner", "Grilled salmon with veggies")}>Salmon</button>
                      <button type="button" style={{ fontSize: "0.9em", padding: "2px 8px", borderRadius: 6, border: "1px solid #4ea8de", background: "#23272f", color: "#4ea8de", cursor: "pointer" }} onClick={() => handlePlanChange("dinner", "Stir-fried tofu and rice")}>Tofu & Rice</button>
                      <button type="button" style={{ fontSize: "0.9em", padding: "2px 8px", borderRadius: 6, border: "1px solid #4ea8de", background: "#23272f", color: "#4ea8de", cursor: "pointer" }} onClick={() => handlePlanChange("dinner", "Chicken and steamed broccoli")}>Chicken & Broccoli</button>
                    </div>
                    <textarea
                      value={nutritionPlan.dinner}
                      onChange={e => handlePlanChange("dinner", e.target.value)}
                      rows={3}
                      placeholder="E.g. Salmon with veggies, tofu & rice, chicken & broccoli..."
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        background: "#23272f",
                        color: "#e0eafc",
                        border: "1px solid #414345",
                        resize: "vertical",
                        fontSize: "var(--font-size-base)"
                      }}
                      disabled={savingPlan}
                    />
                  </div>

                  {feedback.message && feedback.type !== "error" && !feedback.message.includes("fetch") && (
                    <div style={{
                      color: feedback.type === "success" ? "#22c55e" : "#f59e0b",
                      background: feedback.type === "success" ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--spacing-sm)",
                      textAlign: "center",
                      marginTop: "var(--spacing-md)"
                    }}>{feedback.message}</div>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={handleSavePlan}
                    disabled={savingPlan}
                    style={{
                      fontWeight: 600,
                      fontSize: "var(--font-size-lg)",
                      padding: "var(--spacing-md) var(--spacing-xl)",
                      borderRadius: "var(--radius-md)",
                      marginTop: "var(--spacing-sm)",
                      letterSpacing: 1,
                      opacity: savingPlan ? 0.7 : 1,
                      cursor: savingPlan ? "not-allowed" : "pointer"
                    }}
                  >
                     {savingPlan ? <FaSpinner className="spin" /> : <FaSave style={{ marginRight: "var(--spacing-sm)" }} />} 
                     {savingPlan ? "Saving..." : "Save Plan"}
                  </button>
                </div>
              )}

                <div className="fade-in">
                 <h2 style={{ fontSize: "1.5rem", color: "#e0eafc", marginBottom: "var(--spacing-md)" }}>
                   <FaHistory style={{ marginRight: "var(--spacing-sm)" }} /> Plan History
                 </h2>
                 {planHistory.length > 0 ? (
                   <ul style={{
                     listStyle: "none",
                     padding: 0,
                     margin: 0,
                     display: "grid",
                     gap: "var(--spacing-md)",
                     textAlign: "left"
                   }}>
                      {planHistory.map((plan, index) => (
                         <li key={index} style={{
                           background: "#23272f",
                           padding: "var(--spacing-md)",
                           borderRadius: "var(--radius-md)",
                           border: "1px solid #414345"
                         }}>
                           <p style={{ fontWeight: 600, marginBottom: "var(--spacing-sm)", color: "#e0eafc" }}>
                             Plan from {new Date(plan.date).toLocaleDateString()}:
                           </p>
                            <p style={{ color: "#b6c6e3", whiteSpace: "pre-wrap" }}>
                               Breakfast: {plan.breakfast || "N/A"}\n
                               Lunch: {plan.lunch || "N/A"}\n
                               Dinner: {plan.dinner || "N/A"}
                            </p>
                         </li>
                      ))}
                   </ul>
                 ) : (
                   <div style={{ color: "#b6c6e3", textAlign: "center" }}>No plan history available.</div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spin {
            animation: spin 1s linear infinite;
          }
           select {
              /* Add custom arrow */
              background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234ea8de%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E');
              background-repeat: no-repeat;
              background-position: right 0.75rem center;
              background-size: 16px 12px;
            }
        `}
      </style>
    </>
  );
}