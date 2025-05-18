import express from "express";
import NutritionPlan from "../models/NutritionPlan.js";

const router = express.Router();

// POST /api/nutrition-plans
router.post("/", async (req, res, next) => {
  try {
    const { patientId, dietDetails, startDate, endDate } = req.body;
    if (!patientId) return res.status(400).json({ error: "patientId is required" });
    const plan = new NutritionPlan({ patientId, dietDetails, startDate, endDate });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
});

// GET /api/nutrition-plans
router.get("/", async (req, res, next) => {
  try {
    const plans = await NutritionPlan.find().populate("patientId", "name");
    res.json(plans);
  } catch (err) {
    next(err);
  }
});

// GET /api/nutrition-plans/:id
router.get("/:id", async (req, res, next) => {
  try {
    const plan = await NutritionPlan.findById(req.params.id).populate("patientId", "name");
    if (!plan) return res.status(404).json({ error: "Nutrition plan not found" });
    res.json(plan);
  } catch (err) {
    next(err);
  }
});

// PUT /api/nutrition-plans/:id
router.put("/:id", async (req, res, next) => {
  try {
    const plan = await NutritionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ error: "Nutrition plan not found" });
    res.json(plan);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/nutrition-plans/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const plan = await NutritionPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ error: "Nutrition plan not found" });
    res.json({ message: "Nutrition plan deleted" });
  } catch (err) {
    next(err);
  }
});

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