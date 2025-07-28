// routes/clientProgress.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const Progress = require('../models/Progress');

// ✅ POST new progress entry (client only)
router.post('/', verifyToken, checkRole('client'), async (req, res) => {
  try {
    const { weight, workoutDone, notes } = req.body;

    const newProgress = new Progress({
      client: req.user.id, // Logged-in client ID
      weight,
      workoutDone,
      notes
    });

    await newProgress.save();
    res.status(201).json(newProgress);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all progress entries for logged-in client
router.get('/', verifyToken, checkRole('client'), async (req, res) => {
  try {
    const progress = await Progress.find({ client: req.user.id }).sort({ date: -1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
