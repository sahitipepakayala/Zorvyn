const User = require("../models/User");

exports.checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.cookies?.userId;

      if (!userId) {
        return res.status(401).json({ message: "Not logged in" });
      }

      const user = await User.findById(userId);

      if (!user || user.status === "inactive") {
        return res.status(403).json({ message: "User not allowed" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // attach user to request
      req.user = user;

      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};