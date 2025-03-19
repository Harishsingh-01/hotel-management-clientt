const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization"); // Get token from headers

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = verified; // Attach user data to request

    console.log("Decoded JWT:", verified); // ✅ Debugging: Check the decoded token structure

    if (!req.user || (!req.user.id && !req.user.userId)) {
      return res.status(401).json({ message: "Invalid token. User ID missing." });
    }

    req.user.id = req.user.id || req.user.userId; // Ensure userId exists
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
