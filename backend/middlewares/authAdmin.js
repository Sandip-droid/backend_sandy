const jwt = require('jsonwebtoken');

const authAdmin = async (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;

    // 2. Validate the format: should start with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        err: true,
        message: "Authorization header missing or malformed",
        data: []
      });
    }

    // 3. Extract the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Check if token payload has correct email and role
    if (
      decoded.email !== process.env.ADMIN_EMAIL ||
      decoded.role !== 'admin'
    ) {
      return res.status(403).json({
        err: true,
        message: "Forbidden: Admin access required",
        data: []
      });
    }

    // 6. Proceed if everything is valid
    next();

  } catch (err) {
    console.error("JWT error:", err.message);

    return res.status(401).json({
      err: true,
      message: "Invalid or expired token",
      data: []
    });
  }
};

module.exports = authAdmin;
