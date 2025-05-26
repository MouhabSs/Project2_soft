import mongoose from "mongoose";

const nutritionPlanHistorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  plan: {
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
    }
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
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
nutritionPlanHistorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const NutritionPlanHistory = mongoose.model('NutritionPlanHistory', nutritionPlanHistorySchema);

export default NutritionPlanHistory; 