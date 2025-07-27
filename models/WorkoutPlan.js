const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  title: { type: String, required: true },
  description: String,
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      rest: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
