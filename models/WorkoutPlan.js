// models/WorkoutPlan.js

const mongoose = require('mongoose');

// 👉 Sub-schema for each exercise in the workout plan
const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sets: {
    type: Number,
    required: true,
    min: 1
  },
  reps: {
    type: Number,
    required: true,
    min: 1
  },
  rest: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    trim: true
  }
});

// 👉 Main Workout Plan schema
const workoutPlanSchema = new mongoose.Schema({
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
  description: {
    type: String,
    default: '',
    trim: true
  },
  exercises: [exerciseSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 👉 Export the model
module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
