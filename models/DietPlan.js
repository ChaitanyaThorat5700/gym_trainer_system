const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
  calories: Number,
  notes: String
});

const dietPlanSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  title: { type: String, required: true },
  meals: [mealSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
