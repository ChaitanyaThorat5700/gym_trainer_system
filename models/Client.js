const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  age: Number,
  weight: Number,
  height: Number,
  goal: String,

  // ✅ ADD THESE:
  mealSchedule: [String],       // e.g. ["09:00", "13:00"]
  workoutSchedule: [String],    // e.g. ["18:00"]

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Client', clientSchema);
