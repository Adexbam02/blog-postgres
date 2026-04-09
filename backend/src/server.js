import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import pool, { initDB } from "./db.js";

import authRouter from "./routes/authRouter.js";
import postsRouter from "./routes/postsRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔧 GLOBAL MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);

// 📁 STATIC FILES (uploads)
app.use(
  "/backend/uploads",
  express.static(path.join(__dirname, "../public/uploads")),
);

// 🧪 HEALTH CHECK
app.get("/", (req, res) => {
  res.status(200).send("API is running 🚀");
});

// 📦 ROUTES
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);

// 🚀 START SERVER (after DB is ready)
const startServer = async () => {
  try {
    // Initialize tables
    await initDB();

    // Test DB connection
    await pool.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
