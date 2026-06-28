import express from "express";
import { getMessages, sendMessage } from "../controllers/chatController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", authenticateToken, getMessages);
router.post("/send", authenticateToken, sendMessage);

export default router;
