// backend/middleware/roleMiddleware.js

module.exports = function checkRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ msg: 'No role found in token' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ msg: 'Forbidden: Insufficient role' });
    }

    next();
  };
};
