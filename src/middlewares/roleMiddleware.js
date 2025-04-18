/**
 * Simple role-based access control middleware
 * Use this for basic role checks where you only need to verify a single role
 * 
 * Example usage:
 * router.use(roleMiddleware('SUPER_ADMIN')) // Only SUPER_ADMIN can access
 * 
 * @param {string} role - The required role to access the route
 * @returns {Function} Middleware function
 */
const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ 
        message: `Access denied. Requires ${role} role.` 
      });
    }
    next();
  };
};

module.exports = roleMiddleware;
  