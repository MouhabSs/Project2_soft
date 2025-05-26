import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { FaAppleAlt, FaBreadSlice, FaDrumstickBite, FaFish, FaUser, FaSave, FaHistory, FaSpinner, FaPlusCircle, FaMinusCircle, FaSeedling, FaFire, FaEgg, FaLeaf } from "react-icons/fa";
import NutritionPlanHistory from "../components/NutritionPlanHistory";

// Define available meal types
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

// Define some preset meal options with nutritional info (placeholders)
const PRESET_MEALS = [
  { type: 'Breakfast', description: 'Oatmeal with berries and nuts', calories: 350, protein: 10, carbs: 55, fat: 10 },
  { type: 'Breakfast', description: 'Scrambled eggs with spinach and whole grain toast', calories: 400, protein: 25, carbs: 30, fat: 20 },
  { type: 'Lunch', description: 'Grilled chicken salad with avocado', calories: 450, protein: 40, carbs: 15, fat: 25 },
  { type: 'Lunch', description: 'Lentil soup with a side of whole-wheat bread', calories: 380, protein: 18, carbs: 60, fat: 8 },
  { type: 'Dinner', description: 'Baked salmon with roasted vegetables', calories: 500, protein: 45, carbs: 25, fat: 28 },
  { type: 'Dinner', description: 'Quinoa and black bean bowls', calories: 420, protein: 15, carbs: 70, fat: 10 },
  { type: 'Snack', description: 'Greek yogurt with honey', calories: 150, protein: 15, carbs: 10, fat: 5 },
  { type: 'Snack', description: 'Apple slices with peanut butter', calories: 200, protein: 8, carbs: 20, fat: 12 },
];

export default function NutritionPlan() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [nutritionPlan, setNutritionPlan] = useState({
    meals: [],
    startDate: '',
    endDate: '',
    _id: null // To store the plan ID if it exists
  });
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" }); // { message: '...', type: 'success' | 'error' }

  // Fetch patients on component mount
  useEffect(() => {
    fetch("/api/patients")
      .then(res => res.json())
      .then(result => {
        if (Array.isArray(result)) {
          setPatients(result);
          setFeedback({ message: "", type: "" });
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
      // API call to fetch patient's nutrition plan using patientId
      fetch(`/api/nutrition-plans/${selectedPatientId}`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            // Set fetched plan data, including _id if it exists
            setNutritionPlan({
              ...result.data,
              meals: Array.isArray(result.data?.meals) ? result.data.meals : []
            });
          } else {
            // If no plan exists or fetching failed, initialize with empty meals
            setNutritionPlan({ meals: [], startDate: '', endDate: '', _id: null });
          }
          setLoadingPlan(false);
        })
        .catch(err => {
          setFeedback({ message: err.message || "Failed to fetch nutrition plan", type: "error" });
          setLoadingPlan(false);
        });
    } else {
      // Reset plan when no patient is selected
      setNutritionPlan({ meals: [], startDate: '', endDate: '', _id: null });
    }
  }, [selectedPatientId]);

  const handleMealChange = (index, field, value) => {
    const updatedMeals = [...nutritionPlan.meals];
    updatedMeals[index][field] = field === 'calories' || field === 'protein' || field === 'carbs' || field === 'fat' ? (value === '' ? undefined : Number(value)) : value;
     // Ensure nutritional values are numbers or undefined
    setNutritionPlan(prevPlan => ({ ...prevPlan, meals: updatedMeals }));
  };

  const handleAddMeal = (type, description, calories, protein, carbs, fat) => {
    setNutritionPlan(prevPlan => ({
      ...prevPlan,
      meals: [...prevPlan.meals, { type, description, calories, protein, carbs, fat }]
    }));
  };

  const handleRemoveMeal = (index) => {
    const updatedMeals = [...nutritionPlan.meals];
    updatedMeals.splice(index, 1);
    setNutritionPlan(prevPlan => ({ ...prevPlan, meals: updatedMeals }));
  };

  const handleDateChange = (field, value) => {
    setNutritionPlan(prevPlan => ({ ...prevPlan, [field]: value }));
  };

  const handleSavePlan = async () => {
    if (!selectedPatientId) {
      setFeedback({ message: "Please select a patient first.", type: "error" });
      return;
    }

    if (nutritionPlan.meals.some(meal => !meal.type || !meal.description)) {
      setFeedback({ message: "Please ensure all added meals have a type and description.", type: "error" });
      return;
    }

    setSavingPlan(true);
    setFeedback({ message: "", type: "" });

    try {
      // Use POST for both creating and updating based on backend logic
      const res = await fetch("/api/nutrition-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatientId,
          plan: {
            meals: nutritionPlan.meals,
            startDate: nutritionPlan.startDate,
            endDate: nutritionPlan.endDate,
            // Recalculate totals here before sending to backend
            totalCalories: totalNutrition.calories,
            totalProtein: totalNutrition.protein,
            totalCarbs: totalNutrition.carbs,
            totalFat: totalNutrition.fat
          }
        }),
      });

      const result = await res.json();

      if (result && result._id) {
        setFeedback({ message: "Nutrition plan saved successfully!", type: "success" });
        setNutritionPlan({
          ...result,
          meals: Array.isArray(result.meals) ? result.meals : []
        });
      } else {
        setFeedback({ message: result.message || "Failed to save nutrition plan", type: "error" });
      }
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save nutrition plan", type: "error" });
    } finally {
      setSavingPlan(false);
    }
  };

   // Helper to get icon for meal type
  const getMealIcon = (type) => {
    switch(type) {
      case 'Breakfast': return <FaBreadSlice color="#ffd580" />; // Warm yellow
      case 'Lunch': return <FaDrumstickBite color="#fbbf24" />; // Amber
      case 'Dinner': return <FaFish color="#60a5fa" />; // Blue
      case 'Snack': return <FaSeedling color="#84cc16" />; // Green
      default: return <FaAppleAlt />;
    }
  };

   // Calculate total nutritional information
  const totalNutrition = (nutritionPlan && nutritionPlan.meals ? nutritionPlan.meals : []).reduce((totals, meal) => {
    totals.calories += meal.calories || 0;
    totals.protein += meal.protein || 0;
    totals.carbs += meal.carbs || 0;
    totals.fat += meal.fat || 0;
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });


  return (
    <>
      <NavBar />
      <div style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "var(--spacing-xl)",
        background: "none"
      }}>
        <div className="card fade-in" style={{
          maxWidth: 700, // Increased max width
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
                    appearance: "none",
                    paddingRight: "calc(var(--spacing-md) * 2 + 16px)",
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
                Assign/Edit Plan
              </h2>

               {/* Date Range */}
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
                 <div>
                    <label style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "#b6c6e3", fontSize: "var(--font-size-sm)" }}>Start Date:</label>
                    <input
                      type="date"
                      value={nutritionPlan.startDate ? new Date(nutritionPlan.startDate).toISOString().split('T')[0] : ''}
                      onChange={e => handleDateChange('startDate', e.target.value)}
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        background: "#23272f",
                        color: "#e0eafc",
                        border: "1px solid #414345",
                         fontSize: "var(--font-size-base)"
                      }}
                       disabled={savingPlan}
                    />
                 </div>
                 <div>
                    <label style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "#b6c6e3", fontSize: "var(--font-size-sm)" }}>End Date:</label>
                    <input
                      type="date"
                      value={nutritionPlan.endDate ? new Date(nutritionPlan.endDate).toISOString().split('T')[0] : ''}
                      onChange={e => handleDateChange('endDate', e.target.value)}
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        background: "#23272f",
                        color: "#e0eafc",
                        border: "1px solid #414345",
                         fontSize: "var(--font-size-base)"
                      }}
                       disabled={savingPlan}
                    />
                 </div>
               </div>

              {loadingPlan ? (
                <div style={{ textAlign: "center" }}>Loading Plan...</div>
              ) : feedback.type === "error" && feedback.message.includes("fetch nutrition plan") ? (
                 <div style={{ color: "#ef4444", textAlign: "center" }}>{feedback.message}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                  {(nutritionPlan.meals || []).map((meal, index) => (
                    <div key={index} style={{
                      background: "#2c2f36",
                      padding: "var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid #414345"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-sm)" }}>
                         <h3 style={{ fontSize: "1.1rem", color: "#e0eafc", margin: 0 }}>
                           {getMealIcon(meal.type)} {meal.type}
                         </h3>
                         <button
                            onClick={() => handleRemoveMeal(index)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ff6b6b",
                              cursor: "pointer",
                              fontSize: "1.2rem"
                            }}
                            disabled={savingPlan}
                            aria-label="Remove meal"
                          >
                            <FaMinusCircle />
                          </button>
                      </div>

                       {/* Meal Type Dropdown */}
                      <select
                        value={meal.type}
                        onChange={e => handleMealChange(index, 'type', e.target.value)}
                        style={{
                           width: "100%",
                           padding: "var(--spacing-sm)",
                           borderRadius: "var(--radius-md)",
                           background: "#23272f",
                           color: "#e0eafc",
                           border: "1px solid #414345",
                            fontSize: "var(--font-size-base)",
                            marginBottom: "var(--spacing-sm)"
                         }}
                        disabled={savingPlan}
                      >
                        <option value="">Select Meal Type</option>
                        {MEAL_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>

                       {/* Meal Description */}
                       <textarea
                        value={meal.description}
                        onChange={e => handleMealChange(index, 'description', e.target.value)}
                        rows={2}
                        placeholder="Description of the meal..."
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm)",
                          borderRadius: "var(--radius-md)",
                          background: "#23272f",
                          color: "#e0eafc",
                          border: "1px solid #414345",
                          resize: "vertical",
                           fontSize: "var(--font-size-base)",
                          marginBottom: "var(--spacing-sm)"
                        }}
                        disabled={savingPlan}
                      />

                       {/* Nutritional Info Inputs */}
                       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "var(--spacing-sm)" }}>
                         <div>
                           <label style={{ display: "block", marginBottom: "var(--spacing-xs)", color: "#b6c6e3", fontSize: "var(--font-size-sm)" }}>Calories:</label>
                            <input
                              type="number"
                              value={meal.calories || ''}
                              onChange={e => handleMealChange(index, 'calories', e.target.value)}
                              placeholder="kcal"
                              min="0"
                              style={{
                                width: "100%",
                                padding: "var(--spacing-sm)",
                                borderRadius: "var(--radius-md)",
                                background: "#23272f",
                                color: "#e0eafc",
                                border: "1px solid #414345",
                                fontSize: "var(--font-size-base)"
                              }}
                               disabled={savingPlan}
                            />
                         </div>
                         <div>
                           <label style={{ display: "block", marginBottom: "var(--spacing-xs)", color: "#b6c6e3", fontSize: "var(--font-size-sm)" }}>Protein:</label>
                            <input
                              type="number"
                              value={meal.protein || ''}
                              onChange={e => handleMealChange(index, 'protein', e.target.value)}
                              placeholder="g"
                              min="0"
                              style={{
                                width: "100%",
                                padding: "var(--spacing-sm)",
                                borderRadius: "var(--radius-md)",
                                background: "#23272f",
                                color: "#e0eafc",
                                border: "1px solid #414345",
                                fontSize: "var(--font-size-base)"
                              }}
                               disabled={savingPlan}
                            />
                         </div>
                         <div>
                           <label style={{ display: "block", marginBottom: "var(--spacing-xs)", color: "#b6c6e3", fontSize: "var(--font-size-sm)" }}>Carbs:</label>
                            <input
                              type="number"
                              value={meal.carbs || ''}
                              onChange={e => handleMealChange(index, 'carbs', e.target.value)}
                              placeholder="g"
                              min="0"
                              style={{
                                width: "100%",
                                padding: "var(--spacing-sm)",
                                borderRadius: "var(--radius-md)",
                                background: "#23272f",
                                color: "#e0eafc",
                                border: "1px solid #414345",
                                fontSize: "var(--font-size-base)"
                              }}
                               disabled={savingPlan}
                            />
                         </div>
                         <div>
                           <label style={{ display: "block", marginBottom: "var(--spacing-xs)", color: "#b6c6e3", fontSize: "var(--font-size-sm)" }}>Fat:</label>
                            <input
                              type="number"
                              value={meal.fat || ''}
                              onChange={e => handleMealChange(index, 'fat', e.target.value)}
                              placeholder="g"
                              min="0"
                              style={{
                                width: "100%",
                                padding: "var(--spacing-sm)",
                                borderRadius: "var(--radius-md)",
                                background: "#23272f",
                                color: "#e0eafc",
                                border: "1px solid #414345",
                                fontSize: "var(--font-size-base)"
                              }}
                               disabled={savingPlan}
                            />
                         </div>
                       </div>

                    </div>
                  ))}

                   {/* Add Meal Buttons */}
                   <div style={{ display: "flex", justifyContent: "center", gap: "var(--spacing-md)", marginTop: "var(--spacing-md)" }}>
                     {MEAL_TYPES.map(type => (
                        <button
                          key={type}
                          onClick={() => handleAddMeal(type)}
                          style={{
                            background: "#414345",
                            color: "#4ea8de",
                            border: "1px solid #4ea8de",
                            borderRadius: "var(--radius-md)",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            fontSize: "var(--font-size-base)",
                            cursor: "pointer",
                             opacity: savingPlan ? 0.7 : 1,
                             cursor: savingPlan ? "not-allowed" : "pointer"
                          }}
                           disabled={savingPlan}
                        >
                          <FaPlusCircle style={{ marginRight: "var(--spacing-xs)" }} /> Add {type}
                        </button>
                     ))}
                   </div>

                   {/* Preset Meals Section */}
                   <div style={{ marginTop: "var(--spacing-lg)", paddingTop: "var(--spacing-md)", borderTop: "1px solid #414345" }}>
                     <h3 style={{ fontSize: "1.1rem", color: "#e0eafc", marginBottom: "var(--spacing-md)" }}>Add Preset Meal:</h3>
                     {MEAL_TYPES.map(mealType => (
                       <div key={mealType} style={{ marginBottom: "var(--spacing-md)" }}>
                         <h4 style={{ fontSize: "1rem", color: "#b6c6e3", marginBottom: "var(--spacing-sm)" }}>{mealType} Presets:</h4>
                         <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-sm)" }}>
                           {PRESET_MEALS.filter(meal => meal.type === mealType).map((preset, index) => (
                             <button
                               key={index}
                               onClick={() => handleAddMeal(preset.type, preset.description, preset.calories, preset.protein, preset.carbs, preset.fat)}
                               style={{
                                 background: "#414345",
                                 color: "var(--text-primary)",
                                 border: "1px solid #414345",
                                 borderRadius: "var(--radius-md)",
                                 padding: "var(--spacing-sm) var(--spacing-md)",
                                 fontSize: "var(--font-size-sm)",
                                 cursor: "pointer",
                                 transition: "background-color 0.2s ease",
                                 opacity: savingPlan ? 0.7 : 1,
                                 cursor: savingPlan ? "not-allowed" : "pointer"
                               }}
                               disabled={savingPlan}
                             >
                               {preset.description}
                             </button>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Total Nutrition Summary */}
                   {nutritionPlan.meals.length > 0 && (
                      <div style={{
                        marginTop: "var(--spacing-lg)",
                        padding: "var(--spacing-md)",
                        background: "#2c2f36",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid #414345"
                      }}>
                        <h3 style={{ fontSize: "1.1rem", color: "#e0eafc", marginBottom: "var(--spacing-sm)", textAlign: "center" }}>Total Nutritional Summary</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "var(--spacing-md)" }}>
                           <div style={{ textAlign: "center", color: "#b6c6e3" }}>
                             <FaFire color="#f97316" style={{ marginRight: "var(--spacing-xs)" }} /> Calories: {totalNutrition.calories.toFixed(1)} kcal
                           </div>
                           <div style={{ textAlign: "center", color: "#b6c6e3" }}>
                              <FaEgg color="#eab308" style={{ marginRight: "var(--spacing-xs)" }} /> Protein: {totalNutrition.protein.toFixed(1)} g
                           </div>
                           <div style={{ textAlign: "center", color: "#b6c6e3" }}>
                             <FaBreadSlice color="#f59e0b" style={{ marginRight: "var(--spacing-xs)" }} /> Carbs: {totalNutrition.carbs.toFixed(1)} g
                           </div>
                            <div style={{ textAlign: "center", color: "#b6c6e3" }}>
                             <FaLeaf color="#22c55e" style={{ marginRight: "var(--spacing-xs)" }} /> Fat: {totalNutrition.fat.toFixed(1)} g
                           </div>
                        </div>
                      </div>
                   )}

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
                    disabled={savingPlan || nutritionPlan.meals.length === 0}
                    style={{
                      fontWeight: 600,
                      fontSize: "var(--font-size-lg)",
                      padding: "var(--spacing-md) var(--spacing-xl)",
                      borderRadius: "var(--radius-md)",
                      marginTop: "var(--spacing-md)",
                      letterSpacing: 1,
                      opacity: (savingPlan || nutritionPlan.meals.length === 0) ? 0.7 : 1,
                      cursor: (savingPlan || nutritionPlan.meals.length === 0) ? "not-allowed" : "pointer"
                    }}
                  >
                     {savingPlan ? <FaSpinner className="spin" /> : <FaSave style={{ marginRight: "var(--spacing-sm)" }} />} 
                     {savingPlan ? "Saving..." : "Save Plan"}
                  </button>

                </div>
              )}

                {/* Plan History Section */}
                 <div style={{ marginTop: "var(--spacing-xl)" }}>
                 <NutritionPlanHistory patientId={selectedPatientId} />
              </div>
            </div>
          )}
        </div>
      </div>
       <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}