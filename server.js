require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/authMiddleware');
const checkRole = require('./middleware/roleMiddleware');

const app = express(); // ✅ Express must be initialized before using app.*

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// ✅ Protected route with role check
app.get('/api/protected', verifyToken, checkRole('trainer'), (req, res) => {
  res.json({
    msg: `✅ Hello ${req.user.id}, you are a ${req.user.role} and accessed a protected trainer route!`
  });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.log(err));
