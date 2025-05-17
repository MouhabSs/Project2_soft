import React from "react";
import NavBar from "./NavBar";

export default function NutritionPlan() {
  return (
    <>
      <NavBar />
      <div className="dashboard-container">
      <h2>Nutrition Plan</h2>
      <div className="dashboard-card">
        <p>Assign or view a basic nutrition plan for the selected patient.</p>
        <ul>
          <li>Breakfast: Oatmeal, fruit</li>
          <li>Lunch: Grilled chicken, salad</li>
          <li>Dinner: Salmon, vegetables</li>
        </ul>
        <button className="addpatient-btn" style={{marginTop: "1rem"}}>Assign Plan</button>
      </div>
    </div>
    </>
  );
}