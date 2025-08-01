// routes/dietPlan.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const DietPlan = require('../models/DietPlan');
const Client = require('../models/Client');

// CREATE a new Diet Plan (Trainer only)
router.post('/clients/:clientId/diet-plans', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const { clientId } = req.params;
    const { title, meals } = req.body;

    const client = await Client.findOne({ _id: clientId, trainer: req.user.id });
    if (!client) return res.status(403).json({ msg: 'Forbidden: Client not found or not yours' });

    if (!title || !Array.isArray(meals)) return res.status(400).json({ msg: 'Title & meals required' });

    const dietPlan = new DietPlan({ client: clientId, title, meals });
    await dietPlan.save();

    res.status(201).json(await dietPlan.populate('client', 'name email'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET all Diet Plans for a Client (Trainer only)
router.get('/clients/:clientId/diet-plans', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findOne({ _id: clientId, trainer: req.user.id });
    if (!client) return res.status(403).json({ msg: 'Forbidden: Client not found or not yours' });

    const plans = await DietPlan.find({ client: clientId }).populate('client', 'name email').sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET a single Diet Plan by ID (Trainer only)
router.get('/diet-plans/:planId', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.planId).populate('client', 'name email');
    if (!plan) return res.status(404).json({ msg: 'Diet Plan not found' });

    const client = await Client.findOne({ _id: plan.client._id, trainer: req.user.id });
    if (!client) return res.status(403).json({ msg: 'Forbidden: Not your client' });

    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// UPDATE a Diet Plan by ID (Trainer only)
router.put('/diet-plans/:planId', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ msg: 'Diet Plan not found' });

    const client = await Client.findOne({ _id: plan.client, trainer: req.user.id });
    if (!client) return res.status(403).json({ msg: 'Forbidden: Not your client' });

    const { title, meals } = req.body;
    if (title) plan.title = title;
    if (meals && Array.isArray(meals)) plan.meals = meals;

    await plan.save();
    res.json(await plan.populate('client', 'name email'));
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE a Diet Plan by ID (Trainer only)
router.delete('/diet-plans/:planId', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ msg: 'Diet Plan not found' });

    const client = await Client.findOne({ _id: plan.client, trainer: req.user.id });
    if (!client) return res.status(403).json({ msg: 'Forbidden: Not your client' });

    await plan.deleteOne();
    res.json({ msg: 'Diet Plan deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// CLIENT: GET own Diet Plans
router.get('/my-diet-plans', verifyToken, checkRole('client'), async (req, res) => {
  try {
    const plans = await DietPlan.find({ client: req.user.id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// CLIENT: GET single Diet Plan by ID
router.get('/my-diet-plans/:planId', verifyToken, checkRole('client'), async (req, res) => {
  try {
    const plan = await DietPlan.findOne({ _id: req.params.planId, client: req.user.id });
    if (!plan) return res.status(404).json({ msg: 'Diet Plan not found' });

    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
