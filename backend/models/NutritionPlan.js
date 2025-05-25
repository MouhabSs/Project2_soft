import mongoose from "mongoose";

const nutritionPlanSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  meals: [{
    type: {
      type: String,
      required: true,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
    },
    description: {
      type: String,
      required: true
    },
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    }
  }],
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  totalCalories: {
    type: Number,
    min: 0
  },
  totalProtein: {
    type: Number,
    min: 0
  },
  totalCarbs: {
    type: Number,
    min: 0
  },
  totalFat: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
nutritionPlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const NutritionPlan = mongoose.model('NutritionPlan', nutritionPlanSchema);

export default NutritionPlan;