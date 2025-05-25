import React, { useState, useEffect } from "react";
import { FaHistory, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";

export default function NutritionPlanHistory({ patientId }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanHistory = async () => {
      try {
        const res = await fetch(`/api/nutrition-plan-history/${patientId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch nutrition plan history");
        }
        const result = await res.json();
        if (!result.success) {
          throw new Error(result.message || "Failed to fetch nutrition plan history");
        }
        setPlans(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanHistory();
  }, [patientId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
        Loading nutrition plan history...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "var(--spacing-md)",
        color: "var(--error-color)"
      }}>
        Error: {error}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "var(--spacing-xl)",
        color: "var(--text-secondary)"
      }}>
        No nutrition plan history found.
      </div>
    );
  }

  return (
    <div style={{
      background: "#20232a",
      borderRadius: 14,
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      padding: "1.5rem 1rem"
    }}>
      <div style={{ 
        fontSize: 20, 
        fontWeight: 600, 
        color: "#e0eafc",
        marginBottom: "var(--spacing-sm)",
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)"
      }}>
        <FaHistory /> Nutrition Plan History
      </div>
      <div style={{ color: "#b6c6e3", fontSize: 15, marginBottom: "var(--spacing-md)" }}>
        View past and current nutrition plans
      </div>
      <div style={{ 
        display: "grid",
        gap: "var(--spacing-md)",
        background: "#232b36",
        borderRadius: 12,
        padding: 12
      }}>
        {plans.map(plan => (
          <div key={plan._id} style={{
            background: "#2c2f36",
            borderRadius: 8,
            padding: "var(--spacing-md)",
            border: plan.status === "active" ? "2px solid var(--primary-color)" : "none"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--spacing-sm)"
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "var(--spacing-sm)",
                color: "#e0eafc"
              }}>
                <FaCalendarAlt />
                <span>{formatDate(plan.createdAt)}</span>
                {plan.status === "active" && (
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "var(--success-color)",
                    fontSize: "0.9rem"
                  }}>
                    <FaCheck /> Active
                  </span>
                )}
              </div>
              {plan.status === "archived" && (
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem"
                }}>
                  <FaTimes /> Archived
                </span>
              )}
            </div>
            <div style={{ marginBottom: "var(--spacing-sm)" }}>
              <div style={{ color: "#b6c6e3", marginBottom: "4px" }}>Total Calories: {plan.plan.totalCalories}</div>
              <div style={{ color: "#b6c6e3", marginBottom: "4px" }}>
                Macros: P {plan.plan.totalProtein}g | C {plan.plan.totalCarbs}g | F {plan.plan.totalFat}g
              </div>
            </div>
            <div style={{ color: "#b6c6e3", fontSize: "0.9rem" }}>
              {plan.plan.meals.length} meals planned
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 