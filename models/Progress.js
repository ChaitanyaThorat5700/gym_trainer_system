// models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // ✅ It's fine to reference 'Client'
    required: true
  },
  weight: Number,
  workoutsDone: Number, // ✅ Match the name in your route and Thunder test
  notes: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Progress', progressSchema);
