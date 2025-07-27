const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Example client profile route
router.get('/profile', verifyToken, checkRole('client'), (req, res) => {
  res.json({
    msg: `✅ Hello ${req.user.id}, you are a ${req.user.role} and accessed your client profile!`
  });
});

module.exports = router;
