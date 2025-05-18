import mongoose from "mongoose";

const nutritionPlanSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  dietDetails: String,
  startDate: Date,
  endDate: Date
});

export default mongoose.model("NutritionPlan", nutritionPlanSchema);