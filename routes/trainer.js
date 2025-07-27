const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const Client = require('../models/Client');

// ✅ Create new client (Trainer only)
router.post('/clients', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const { name, email, age, weight, height, goal } = req.body;

    const client = new Client({
      name,
      email,
      age,
      weight,
      height,
      goal,
      trainer: req.user.id
    });

    await client.save();
    res.status(201).json(client);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all clients for this trainer
router.get('/clients', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const clients = await Client.find({ trainer: req.user.id });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a client
router.put('/clients/:id', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const updated = await Client.findOneAndUpdate(
      { _id: req.params.id, trainer: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: 'Client not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a client
router.delete('/clients/:id', verifyToken, checkRole('trainer'), async (req, res) => {
  try {
    const deleted = await Client.findOneAndDelete({
      _id: req.params.id,
      trainer: req.user.id
    });

    if (!deleted) return res.status(404).json({ msg: 'Client not found' });

    res.json({ msg: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
