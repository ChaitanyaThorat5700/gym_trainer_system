const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

const Progress = require('../models/Progress'); // ✅ Make sure this exists!

// ✅ Example profile route
router.get('/profile', verifyToken, checkRole('client'), (req, res) => {
  res.json({
    msg: `✅ Hello ${req.user.id}, you are a ${req.user.role} and accessed your client profile!`
  });
});

// ✅ POST /api/client/progress - log new progress
router.post('/progress', verifyToken, checkRole('client'), async (req, res) => {
  try {
    const { weight, workoutsDone, notes } = req.body;

    const newProgress = new Progress({
      client: req.user.id,
      weight,
      workoutsDone,
      notes,
    });

    await newProgress.save();
    res.status(201).json(newProgress);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ GET /api/client/progress - get all progress logs for this client
router.get('/progress', verifyToken, checkRole('client'), async (req, res) => {
  try {
    const progress = await Progress.find({ client: req.user.id }).sort({ date: -1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ PUT /api/client/progress/:id - update a progress log
router.put('/progress/:id', verifyToken, checkRole('client'), async (req, res) => {
  try {
    const updated = await Progress.findOneAndUpdate(
      { _id: req.params.id, client: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: 'Progress not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ DELETE /api/client/progress/:id - delete a progress log
router.delete('/progress/:id', verifyToken, checkRole('client'), async (req, res) => {
  try {
    const deleted = await Progress.findOneAndDelete({
      _id: req.params.id,
      client: req.user.id,
    });

    if (!deleted) return res.status(404).json({ msg: 'Progress not found' });

    res.json({ msg: 'Progress deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
