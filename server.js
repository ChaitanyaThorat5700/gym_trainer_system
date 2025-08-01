// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const trainerRoutes = require('./routes/trainer');
const clientRoutes = require('./routes/client');
const clientProgressRoutes = require('./routes/clientProgress');

// ✅ NEW: Import Diet and Workout Plan routes
const dietPlanRoutes = require('./routes/dietPlan');
const workoutPlanRoutes = require('./routes/workoutPlan');

const verifyToken = require('./middleware/authMiddleware');
const checkRole = require('./middleware/roleMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Auth routes
app.use('/api/auth', authRoutes);

// ✅ Trainer routes
app.use('/api/trainer', trainerRoutes);

// ✅ Client routes
app.use('/api/client', clientRoutes);

// ✅ Client Progress routes - FIXED: More specific route first
app.use('/api/client/progress', clientProgressRoutes);

// ✅ NEW: Diet Plan routes
app.use('/api/diet', dietPlanRoutes);

// ✅ NEW: Workout Plan routes  
app.use('/api/workout', workoutPlanRoutes);

// ✅ Protected trainer-only test route
app.get('/api/protected', verifyToken, checkRole('trainer'), (req, res) => {
  res.json({
    msg: `✅ Hello ${req.user.id}, you are a ${req.user.role} and accessed a protected trainer route!`
  });
});

// ✅ Protected client-only test route
app.get('/api/client/profile', verifyToken, checkRole('client'), (req, res) => {
  res.json({
    msg: `✅ Hello ${req.user.id}, you are a ${req.user.role} and accessed your client profile!`
  });
});

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.log(err));