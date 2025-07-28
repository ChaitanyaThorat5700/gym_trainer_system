// models/Client.js

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
  email: {  // Optional: if you want each client to have an email
    type: String,
    unique: true,
    sparse: true // allows multiple docs to omit the field
  },
  age: Number,
  weight: Number,
  height: Number,
  goal: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Client', clientSchema);
