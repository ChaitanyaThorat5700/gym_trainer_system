// routes/workoutPlan.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const WorkoutPlan = require('../models/WorkoutPlan');
const Client = require('../models/Client');

// CREATE a new Workout Plan (Trainer only)
router.post('/clients/:clientId/workout-plans', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const { clientId } = req.params;
    const { title, description, exercises } = req.body;

    const client = await Client.findOne({ _id: clientId, trainer: req.user.id });
    if (!client) return res.status(403).json({ msg: 'Forbidden: Client not found or not yours' });

    if (!title || !Array.isArray(exercises)) return res.status(400).json({ msg: 'Title & exercises required' });

    const workoutPlan = new WorkoutPlan({ client: clientId, title, description, exercises });
    await workoutPlan.save();

    res.status(201).json(await workoutPlan.populate('client', 'name email'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET all Workout Plans for a Client (Trainer only)
router.get('/clients/:clientId/workout-plans', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.clientId, trainer: req.user.id });
    if (!client) return res.status(403).json({ msg: 'Forbidden: Client not found or not yours' });

    const plans = await WorkoutPlan.find({ client: req.params.clientId }).populate('client', 'name email').sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET a single Workout Plan by ID (Trainer only)
router.get('/workout-plans/:planId', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.planId).populate('client', 'name email');
    if (!plan) return res.status(404).json({ msg: 'Workout Plan not found' });

    const client = await Client.findOne({ _id: plan.client._id, trainer: req.user.id });
    if (!client) return res.status(403).json({ msg: 'Forbidden: Not your client' });

    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// UPDATE a Workout Plan (Trainer only)
router.put('/workout-plans/:planId', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ msg: 'Workout Plan not found' });

    const client = await Client.findOne({ _id: plan.client, trainer: req.user.id });
    if (!client) return res.status(403).json({ msg: 'Forbidden: Not your client' });

    const { title, description, exercises } = req.body;
    if (title) plan.title = title;
    if (description !== undefined) plan.description = description;
    if (exercises && Array.isArray(exercises)) plan.exercises = exercises;

    await plan.save();
    res.json(await plan.populate('client', 'name email'));
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE a Workout Plan (Trainer only)
router.delete('/workout-plans/:planId', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ msg: 'Workout Plan not found' });

    const client = await Client.findOne({ _id: plan.client, trainer: req.user.id });
    if (!client) return res.status(403).json({ msg: 'Forbidden: Not your client' });

    await plan.deleteOne();
    res.json({ msg: 'Workout Plan deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// CLIENT: GET own Workout Plans
router.get('/my-workout-plans', verifyToken, checkRole('client'), async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ client: req.user.id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// CLIENT: GET single Workout Plan by ID
router.get('/my-workout-plans/:planId', verifyToken, checkRole('client'), async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.planId, client: req.user.id });
    if (!plan) return res.status(404).json({ msg: 'Workout Plan not found' });

    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
