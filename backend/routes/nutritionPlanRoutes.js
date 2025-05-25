import express from "express";
import NutritionPlan from "../models/NutritionPlan.js";
import NutritionPlanHistory from "../models/NutritionPlanHistory.js";

const router = express.Router();

// Get nutrition plan for a patient
router.get('/:patientId', async (req, res) => {
  try {
    const plan = await NutritionPlan.findOne({ patientId: req.params.patientId });
    if (!plan) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create or update nutrition plan
router.post('/', async (req, res) => {
  try {
    const { patientId, plan } = req.body;

    if (!patientId) {
      return res.status(400).json({ success: false, message: "patientId is required" });
    }

    if (!plan || !plan.meals) {
      return res.status(400).json({ success: false, message: "Invalid plan data" });
    }

    // Archive any existing active plans for this patient
    await NutritionPlanHistory.updateMany(
      { patientId, status: 'active' },
      { status: 'archived' }
    );

    // Create a new history entry
    const historyEntry = new NutritionPlanHistory({
      patientId,
      plan,
      status: 'active'
    });
    await historyEntry.save();

    // Update or create the current plan
    const updatedPlan = await NutritionPlan.findOneAndUpdate(
      { patientId },
      { patientId, ...plan },
      { new: true, upsert: true }
    );

    res.json({ 
      success: true, 
      message: 'Nutrition plan saved successfully',
      data: updatedPlan
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/nutrition-plans - Get all nutrition plans (optional, mostly for admin)
router.get("/", async (req, res, next) => {
  try {
    const plans = await NutritionPlan.find().populate("patientId", "name");
    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/nutrition-plans/:patientId - Delete nutrition plan for a specific patient
router.delete("/:patientId", async (req, res, next) => {
  try {
    const plan = await NutritionPlan.findOneAndDelete({ patientId: req.params.patientId });
    if (!plan) return res.status(404).json({ success: false, message: "Nutrition plan not found for this patient" });
    res.json({ success: true, message: "Nutrition plan deleted" });
  } catch (err) {
    next(err);
  }
});

// NOTE: The frontend also had a placeholder for fetching history (/api/nutritionplan/${selectedPatientId}/history). We haven't implemented history in the backend yet. You might want to add this later if needed.

export default router;

/*
Example JSON for POST/PUT:
{
  "patientId": "609c1f2b8f1b2c0015b2c123",
  "dietDetails": "Low carb, high protein",
  "startDate": "2025-05-12",
  "endDate": "2025-06-12"
}
*/