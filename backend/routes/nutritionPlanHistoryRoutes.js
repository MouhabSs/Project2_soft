import express from "express";
import NutritionPlanHistory from "../models/NutritionPlanHistory.js";

const router = express.Router();

// Get all nutrition plans for a patient
router.get('/:patientId', async (req, res) => {
  try {
    const plans = await NutritionPlanHistory.find({ patientId: req.params.patientId })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .populate('patientId', 'name');

    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get active nutrition plan for a patient
router.get('/:patientId/active', async (req, res) => {
  try {
    const plan = await NutritionPlanHistory.findOne({ 
      patientId: req.params.patientId,
      status: 'active'
    }).populate('patientId', 'name');

    if (!plan) {
      return res.status(404).json({ 
        success: false, 
        message: 'No active nutrition plan found for this patient' 
      });
    }

    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/nutrition-plan-history - Create a new nutrition plan history entry
router.post("/", async (req, res, next) => {
  try {
    const { patientId, plan } = req.body;

    if (!patientId || !plan) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and plan details are required"
      });
    }

    // Archive the current active plan if it exists
    await NutritionPlanHistory.updateMany(
      { patientId, status: "active" },
      { status: "archived" }
    );

    // Create new plan
    const newPlan = new NutritionPlanHistory({
      patientId,
      plan,
      status: "active"
    });

    await newPlan.save();

    res.status(201).json({
      success: true,
      message: "Nutrition plan history created successfully",
      data: newPlan
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next(err);
  }
});

export default router; 