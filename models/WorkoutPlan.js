const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: Number,
  reps: Number,
  restTime: String,
  notes: String
});

const workoutPlanSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  title: { type: String, required: true },
  exercises: [exerciseSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
