import express from "express";
const router = express.Router();
import bycrypt from "bcryptjs";
import db from "../db.js";
import jwt from "jsonwebtoken";
import authenticateToken from "../middleware/authenticateToken.js";

const RESERVED_USERNAMES = [
  "write",
  "login",
  "register",
  "admin",
  "settings",
  "api",
];

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(`Register route: ${username}, ${email}`);

  try {
    // Validate user input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
      return res.status(400).json({ error: "This username is reserved" });
    }

    const hashedPassword = bycrypt.hashSync(password, 12);

    // Check if user already exists
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Create new user
    await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );
    console.log("New user registered:", { username, email });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //Find the user by EMAIL ONLY
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    //  Check if user exists
    if (userResult.rows.length === 0) {
      // Using a generic error for security
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    //  Comparing the plain-text password from the request  with the hashed password from the database
    const isPasswordValid = bycrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username }, // This is the payload (info inside the token)
      process.env.JWT_SECRET, // This is the secret key
      { expiresIn: "1h" }, // The token expires in 1 hour
    );

    //Send the user info back
    return res.status(200).json({
      message: "Login successful",
      username: user.username,
      token: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
