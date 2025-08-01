// models/DietPlan.js

const mongoose = require('mongoose');

// 👉 Sub-schema for each meal in the diet plan
const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  calories: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
});

// 👉 Main Diet Plan schema
const dietPlanSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  meals: [mealSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 👉 Export the model
module.exports = mongoose.model('DietPlan', dietPlanSchema);
