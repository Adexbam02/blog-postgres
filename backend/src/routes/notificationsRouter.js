import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { getNotifications } from "../controllers/notifications/getNotifications.js";

const router = express.Router();

// GET all notifications for logged in user
router.get("/", authenticateToken, getNotifications);

export default router;
