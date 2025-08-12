const jwt = require('jsonwebtoken');

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    // ✅ Get token from headers
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: 'Not Authorized. Please login again.' });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach userId to request (safer to put in req.user instead of req.body)
    req.userId = decoded.id;

    // Continue to next middleware
    next();

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
module.exports= authUser;
