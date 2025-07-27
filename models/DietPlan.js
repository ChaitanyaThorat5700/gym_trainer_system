const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  title: { type: String, required: true },
  meals: [
    {
      name: String,
      time: String,
      calories: Number,
      notes: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
