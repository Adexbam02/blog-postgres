import jwt from "jsonwebtoken";

function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded should include username, id, etc.
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
