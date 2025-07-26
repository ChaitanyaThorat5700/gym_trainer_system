const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'Access Denied: No token provided' });
  }

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = verified; // Attach the decoded token to req.user
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid Token' });
  }
};

module.exports = verifyToken;
