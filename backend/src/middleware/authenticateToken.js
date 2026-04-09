import jwt from "jsonwebtoken";

// the authentication middleware
function authenticateToken(req, res, next) {
  // Get the token from the 'Authorization' header
  // It's usually in the format: "Bearer <TOKEN>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    // No token provided
    return res.status(401).json({ message: "Access token is missing" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Token is invalid...expired, wrong secret
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    // console.log("Auth header:", authHeader);
    // console.log("Decoded user:", user);

    // Token is valid! Attach the user payload to the request
    req.user = user;
    // Move on to the the route handler
    next();
  });

//   console.log("Cookies:", req.cookies);
// console.log("User:", req.user);

}

export default authenticateToken;
